import { Link, useParams } from 'react-router-dom'
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import Header from '../components/layout/Header'
import { IMessage, ISendMessage } from '../interface/interfaces';
import Textarea from '../components/shared/Textarea';
import Button from '../components/shared/Button';
import { getUserByUsername, sendMessage } from '../api/App';
import NotFound from '../assets/images/404-error.png'
import Loader from '../components/shared/Loader';



const schema = yup.object().shape({
    message: yup.string().min(5).required(),
}).required();
function SendMessage() {

    const { username } = useParams()
    const queryClient = useQueryClient()

    const { isError, isLoading, data } = useQuery({
        queryKey: ['user-by-username'],
        queryFn: () => getUserByUsername(username!),
        enabled: !!username
    })

    const { handleSubmit, control, reset, formState: { errors } } = useForm<IMessage>({
        resolver: yupResolver(schema),
        defaultValues: {
            message: '',
        }
    });


    const mutation = useMutation({
        mutationFn: (data: ISendMessage) => sendMessage(data),
        onError: (err:any) => {
            toast.error(`${err.response.data.message}`);
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['messages'] })
            toast.success(`${data.message}`)
            reset()
        },
    })


    const onSubmit = (value: IMessage) => {
        const form = {
            messagesId: data?.messagesId,
            userId: data._id,
            message: value.message
        }
        mutation.mutate(form)
    }


    return (
        <main className='pinkgradient text-white h-[100vh]'>
            <div className='max-w-[420px] sm:max-w-md xl:max-w-lg mx-auto md:flex md:flex-col md:items-center md:justify-center'>
                <Header linkText='Login' link='/login' showLink={false}/>
                {
                    isLoading && !isError &&
                    <div className='px-6 mt-10 w-full'>
                        <div className='h-[72px] rounded-md bg-lilac animate-pulse'></div>
                        <div className='h-[24px] mt-4 rounded-md bg-lilac animate-pulse'></div>
                        <div className='h-[144px] mt-10 rounded-md bg-lilac animate-pulse'></div>
                        <div className='h-[48px] mt-5 rounded-md bg-lilac animate-pulse'></div>
                    </div>
                }
                {
                    !isLoading && isError &&
                    <div className='px-6 mt-10 w-full text-center'>
                        <img src={NotFound} className='mx-auto'/>
                        <p className='text-xl'>It appears this user does not exist. Are you sure you have the right link?</p>
                        <p className='mt-10 underline text-lilac'>
                            <Link to='/app/messages'> Find user </Link>
                        </p>
                    </div>
                }
                {
                    !isError && !isLoading && data &&
                    <div className='px-6 mt-10'>
                        <h2 className='text-3xl'>Send {data.username} an anoymous message</h2>
                        <p className='mt-4'>Please be respectful.</p>
                        <form onSubmit={handleSubmit(onSubmit)} className='mt-10 flex flex-col gap-5'>
                            <Controller
                                name="message"
                                control={control}
                                render={({ field }) => <Textarea {...field} errors={errors} type='text' placeholder='Make comment...' className='placeholder:italic px-4 text-darkblue' />}
                            />
                            <Button className=' text-center'>
                                {
                                    mutation?.isLoading ? <Loader/>
                                    : 'Send Message'
                                }
                            </Button>
                        </form>
                        <p className='text-center mt-10'>
                            <Link to='/app/messages'> Back to app </Link>
                        </p>
                    </div>
                }
            </div>
        </main>
    )
}

export default SendMessage