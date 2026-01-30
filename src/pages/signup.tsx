import { Alert, Button, Input, Card, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../configdb/supabase";

const { Title, Text } = Typography;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signupUser = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
else {
     setLoading(false);
     navigate("/"); 
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
          Create Account
        </Title>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          Signup to continue
        </Text>

        {error && (
          <Alert
            message="Signup Failed"
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
          onClick={signupUser}
        >
          Signup
        </Button>

        <Text
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 16,
            cursor: "pointer",
            color: "#1890ff",
          }}
          onClick={() => navigate("/")} // Navigate back to Login
        >
          Already have an account? Login
        </Text>
      </Card>
    </div>
  );
};

export default Signup;
