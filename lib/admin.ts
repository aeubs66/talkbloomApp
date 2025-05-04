import { auth } from "@clerk/nextjs";

const allowedId = [
  "user_2sehoQlGYc9wgPARxdzDuY10K6p",
  "user_2vX9rDvaGp9NtXWm7hIQvTjkFTf"
]

export const getIsAdmin = () => {
  const { userId } =  auth()


if(!userId) {
  return false
}
 
  return allowedId.indexOf(userId) !== -1;

}