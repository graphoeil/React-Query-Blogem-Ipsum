// Imports
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools"
import Posts from "./Posts";

// Query client
const queryClient = new QueryClient();

// Component
const App = () => {

	// Return
	return(
		<QueryClientProvider client={ queryClient }>
			<h1>Blog'em Ipsum</h1>
			<Posts/>
			<ReactQueryDevtools/>
		</QueryClientProvider>
	);

};

// Export
export default App;