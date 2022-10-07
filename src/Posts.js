// Imports
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import PostDetail from "./PostDetail";

// Variables
const maxPostPage = 10;

// Async methods
const fetchPosts = async(pageNum) => {
	const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${ pageNum }`);
	return response.json();
};

/* staleTime
staleTime is for re-fetching
staleTime translates to "max age", 
or how to tolerate data potentially being out of date */

/* cacheTime for cache
Cache is for data that might be re-used later, 
query goes into "cold storage" if there's no active useQuery.
Cache data expires after cacheTime (default 5 minutes).
After the cache expires, the data is garbage collected and no longer available for the client.
Cache is backup data to display while fetching */

/* Prefetch is a method of QueryClient we use the useQueryClient hook
Prefetching can be used for any anticipated data needs
Add data to cache
Automatically stale (configurable)
Shows fetch data while re-fetching (no loading) as long as cache hasn't expired! */

// Component
const Posts = () => {

	// States
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedPost, setSelectedPost] = useState(null);

	// Pre-fetching
	// Any time the currentPage changes we pre-fetch the next data
	const queryClient = useQueryClient();
	useEffect(() => {
		// No need to prefetch if we have reached the last page
		if (currentPage < maxPostPage){
			const nextPage = currentPage + 1;
			queryClient.prefetchQuery(['posts', nextPage], () => { return fetchPosts(nextPage); });	
		}
	},[currentPage, queryClient]);

	// useQuery
	// 1st argument => query key, the name of the query
	// 2nd argument => the query function
	// 3rd argument => options like staleTime
	const { data, isLoading, isError, error } = useQuery(['posts', currentPage], () => { return fetchPosts(currentPage); }, {
		staleTime:2000,
		// Keep past data (pre-fetch) in the cache
		keepPreviousData:true
	});

	// Returns
	if (isLoading){
		return(
			<h3>Loading...</h3>
		);
	}
	// React Query, show error after 3 failed attempts
	if (isError){
		return(
			<React.Fragment>
				<h3>Oops, something went wrong...</h3>
				<p>{ error.toString() }</p>
			</React.Fragment>
		);
	}
	return(
		<React.Fragment>
			<ul>
				{
					data.map((post) => {
						const { id, title } = post;
						return(
							<li key={ id } className="post-title" 
								onClick={ () => { setSelectedPost(post); } }>
								{ title }
							</li>
						)
					})
				}
			</ul>
			<div className="pages">
				<button disabled={ currentPage <= 1 } onClick={ () => { setCurrentPage((oldState) => {
					return oldState - 1;
				}) } }>
					Previous page
				</button>
				<span>Page { currentPage }</span>
				<button disabled={ currentPage > 9 } onClick={() => { setCurrentPage((oldState) => {
					return oldState + 1;
				}) }}>
					Next page
				</button>
			</div>
			<hr />
			{ selectedPost && <PostDetail { ...selectedPost } /> }
		</React.Fragment>
	);

};

// Export
export default Posts;