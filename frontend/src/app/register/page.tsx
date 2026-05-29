"use client";

import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Register success");

      router.push("/login");
    } catch {
      toast.error("Register failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg">
        <h1 className="mb-8 text-4xl font-bold">
          Register
        </h1>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-xl border p-4"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border p-4"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border p-4"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={handleRegister}
            className="w-full rounded-xl bg-green-600 p-4 text-white"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}