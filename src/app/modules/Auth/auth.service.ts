const loginUser = async (payload: { email: string; password: string }) => {
  console.log("user logged in", payload);
};

export const AuthServices = {
  loginUser,
};
