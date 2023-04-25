import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, RouterProvider, createBrowserRouter, Routes } from 'react-router-dom'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { Toaster } from "react-hot-toast";
import './App.css'
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Application from "./pages/App";
import SendMessage from "./pages/SendMessage";
import Messages from "./components/pages/Messages";
import Users from "./components/pages/Users";
import Error404 from "./components/shared/Error404";
import UserMessages from "./components/pages/UserMessages";
import Settings from "./components/pages/Settings";


function App() {

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 10*(60*1000), // 10 mins
				cacheTime: 15*(60*1000), // 15 mins
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
	})

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
			errorElement: <Error404/>
		},
		{
			path: "/:id",
			element: <SendMessage />,
			errorElement: <Error404/>,
		},
		{
			path: "/register",
			element: <Register />,
			errorElement: <Error404/>,
		},
		{
			path: "/login",
			element: <Login />,
			errorElement: <Error404/>,
		},
		{
			element: <Application />,
			children: [
				{
					path: "/app/messages",
					element: <Messages />,
				},
				{
					path: "/app/users",
					element: <Users />,
				},
				{
					path: "/app/users/:id",
					element: <UserMessages />,
				},
				{
					path: "/app/settings",
					element: <Settings />,
				},
			],
			errorElement: <Error404/>,
		},
	]);

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 2000,
					error: {
						style: {
							borderRadius: '30px',
							background: '#210449',
							color: '#fff',
						},
						icon: <AiOutlineClose color='red' size={20} className="font-medium"/>
					},
					success: {
						style: {
						borderRadius: '30px',
							background: '#fff',
							color: '#040321',
						},
						icon: <AiOutlineCheck color='green' size={20} className="font-medium"/>
					},
				}}
			/>
			<RouterProvider
				router={router}
			/>
		</QueryClientProvider>
		
		// <BrowserRouter>
		// 	<QueryClientProvider client={queryClient}>
		// 		<Toaster
		// 			position="top-center"
		// 			toastOptions={{
		// 				duration: 2000,
		// 				error: {
		// 					style: {
		// 						borderRadius: '30px',
		// 						background: '#210449',
		// 						color: '#fff',
		// 					},
		// 					icon: <AiOutlineClose color='red' size={20} className="font-medium"/>
		// 				},
		// 				success: {
		// 					style: {
		// 						borderRadius: '30px',
		// 						background: '#fff',
		// 						color: '#040321',
		// 					},
		// 					icon: <AiOutlineCheck color='green' size={20} className="font-medium"/>
		// 				},
		// 			}}
		// 		/>
		// 		<Routes>
		// 			<Route path='/' element={<Home/>} errorElement={<Error404/>}/>
		// 			<Route path='/:id' element={<SendMessage/>}/>
		// 			<Route path='/register' element={<Register/>}/>
		// 			<Route path='/login' element={<Login/>}/>
		// 			<Route element={<Application/>}>
		// 				<Route path='/app/messages' element={<Messages/>}/>
		// 				<Route path='/app/users' element={<Users/>}/>
		// 			</Route>
		// 		</Routes>
		// 	</QueryClientProvider>
		// </BrowserRouter>
	)
}

export default App
