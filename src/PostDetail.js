// Imports
import React from "react";
import { useQuery, useMutation } from "react-query";

// Async methods
const fetchComments = async(postId) => {
	const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${ postId }`);
	return response.json();
};
const deletePost = async(postId) => {
	const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${ postId }`,
	  { method:'DELETE' }
	);
	return response.json();
};
const updatePost = async(postId) => {
	const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${ postId }`,
	  { method:'PATCH', data:{ title:'REACT QUERY FOREVER!!!!' } }
	);
	return response.json();
};

// Component
const PostDetail = ({ id, title, body }) => {

	// useQuery
	// Here we pass as query key an array instead of a string,
	// this way when we click on another blog title
	// a new request will then be launched, if we were still using "comments"
	// React Query does not perceive that we want to launch a new query
	// to retrieve comments from another post.
	const { data, isLoading, isError, error } = useQuery(['comments', id], () => { return fetchComments(id); });

	// useMutation
	const deleteMutation = useMutation((postId) => { deletePost(id); });
	const updateMutation = useMutation((postId) => { updatePost(id); });

	// Returns
	if (isLoading){
		return(
			<React.Fragment>
				<h3>Loading...</h3>
			</React.Fragment>
		);
	}
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
			<h3 style={ { color:'blue' } }>{ title }</h3>
			<button onClick={ () => { deleteMutation.mutate(id); } }>
				Delete
			</button>
			{ deleteMutation.isError && <p style={ { color:'firebrick' } }>Error deleting the post</p> }
			{ deleteMutation.isLoading && <p style={ { color:'purple' } }>Deleting the post</p> }
			{ deleteMutation.isSuccess && <p style={ { color:'green' } }>Post deleted</p> }
			<button onClick={ () => { updateMutation.mutate(id); } }>
				Update title
			</button>
			{ updateMutation.isError && <p style={ { color:'firebrick' } }>Error updating the post</p> }
			{ updateMutation.isLoading && <p style={ { color:'purple' } }>Updating the post</p> }
			{ updateMutation.isSuccess && <p style={ { color:'green' } }>Post updated</p> }
			<p>{ body }</p>
			<h4>Comments</h4>
			{
				data.map((comment) => {
					const { id, email, body } = comment;
					return(
						<li key={ id }>
							{ email }: { body }
						</li>
					);
				})
			}
		</React.Fragment>
	);

};

// Export
export default PostDetail;