import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAppSelector } from "../redux/store";
import { useLogoutUserMutation } from "../redux/api/authApi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { LoadingButton as _LoadingButton } from "@mui/lab";

const LoadingButton = styled(_LoadingButton)`
  padding: 0.4rem;
  background-color: #f9d13e;
  color: #2363eb;
  font-weight: 500;

  &:hover {
    background-color: #ebc22c;
    transform: translateY(-2px);
  }
`;

const Header = () => {
  const [cookies] = useCookies(["logged_in"]);
  const logged_in = cookies.logged_in;

  const navigate = useNavigate();

  const [logoutUser, { isLoading, isSuccess, error, isError }] =
    useLogoutUserMutation();
  const user = useAppSelector((state) => state.userState.user);

  useEffect(() => {
    if (isSuccess) {
      window.location.href = "/login";
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onLogoutHandler = async () => {
    logoutUser();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            ✨AUTH✨
          </Typography>
          <Box display="flex" sx={{ ml: "auto" }}>
            {!logged_in && (
              <>
                <LoadingButton
                  sx={{ mr: 2 }}
                  onClick={() => navigate("/register")}
                >
                  SignUp
                </LoadingButton>
                <LoadingButton onClick={() => navigate("/login")}>
                  Login
                </LoadingButton>
              </>
            )}
            {logged_in && (
              <LoadingButton
                sx={{ backgroundColor: "#eee" }}
                onClick={onLogoutHandler}
                loading={isLoading}
              >
                Logout
              </LoadingButton>
            )}
            {logged_in && user?.role === "admin" && (
              <LoadingButton
                sx={{ backgroundColor: "#eee", ml: 2 }}
                onClick={() => navigate("/admin")}
              >
                Admin
              </LoadingButton>
            )}

            {logged_in && (
              <Box sx={{ ml: 4 }}>
                <Tooltip title="Profile" onClick={() => navigate("/profile")}>
                  <IconButton sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.name.toLocaleUpperCase()}
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
