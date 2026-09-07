'use client'
import { useState, useEffect } from "react";
import { AnimatedModalDemo } from "../global/popup-form";
import { userFormStatus } from "@/actions/user";

const FormStateChecker = () => {
  const [formStatus, setFormStatus] = useState<boolean | null>(null); // State to store formFilled status
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error message

  useEffect(() => {
    // Function to fetch form status when component mounts
    const fetchFormStatus = async () => {
      try {
        const response = await userFormStatus();
        if (response.status === 200 && response.data?.formFilled !== undefined) {
          setFormStatus(response.data.formFilled); // Set the formFilled value
        } else {
          setError("Failed to fetch form status.");
        }
      } catch (error) {
        setError("Error fetching form status.");
      } finally {
        setLoading(false); // Set loading to false once the request completes
      }
    };

    fetchFormStatus(); // Call the function when the component mounts
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error message

  // If formFilled is false, show the modal
  return formStatus === false ? <AnimatedModalDemo/> : <></>;
};

export default FormStateChecker;
