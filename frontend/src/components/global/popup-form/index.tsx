"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../../ui/animated-modal";
import Loader from "../loader";
import { onBoardUsername } from "@/actions/user";

export function AnimatedModalDemo() {
  // const [business_name, setBusinessName] = useState("");
  const [business_info, setBusinessText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ( !business_info) {
      toast.error("Please provide all fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const user = await onBoardUsername()
      formData.append("business_name", user!.data!.fullName);
      formData.append("business_info", business_info);
      
      const response = await fetch("/api/proxyBusiness", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const data = await response.json();
      console.log("Data from proxy API", data);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Setup Your Business
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">

            ✨

          </div>
        </ModalTrigger>

        <ModalBody>
          <ModalContent>
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
              Discover the power of{" "}
              <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                Slide Automation
              </span>{" "}
              ✨
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-8">
              {/* <div>
                <label
                  htmlFor="business_name"
                  className="block text-neutral-700 dark:text-neutral-300 text-sm"

                >
                  Business Name
                </label>
                <input
                  id="business_name"
                  name="business_name"
                  type="text"
                   
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm"
                  required
                />
              </div> */}

              <div>
                <label
                  htmlFor="busines_info"
                  className="block text-neutral-700 dark:text-neutral-300 text-sm"
                >
                  Enter Description
                </label>
                <input
                  id="business_info"
                  name="busines_info"
                  type="text"
                  value={business_info}
                  onChange={(e) => setBusinessText(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm"
                  required
                />
              </div>

              <ModalFooter className="gap-4 mt-8">
                <Loader state={loading}>
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
                  >
                    Submit
                  </button>
                </Loader>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
}
