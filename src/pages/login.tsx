import { Alert, Button, Input, Card, Typography } from "antd";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import supabase from "../configdb/supabase";

const { Title, Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
else {
  
    navigate("/dashboard");
    setLoading(false);
}
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
      }}
    >
      <Card style={{ width: 380 }} bordered={false} hoverable>
        <Title level={3} style={{ textAlign: "center" }}>
          Welcome Back 
        </Title>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Login to continue
        </Text>

        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Input
          placeholder="Email"
          size="large"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <Input.Password
          placeholder="Password"
          size="large"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          onClick={loginUser}
        >
          Login
        </Button>

        <Text
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Don’t have an account?{" "}
          <Link to="/signup" style={{ fontWeight: 500 }}>
            Create one
          </Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
