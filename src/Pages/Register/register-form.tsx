"use client";

import type React from "react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ToastProvider } from "@/components/ui/toast";
import { Building2, Phone, MapPin } from "lucide-react";

import { useDispatch } from "react-redux";
import { registerCompany } from "@/store/companySilice";
import { Label } from "@radix-ui/react-label";

// Define validation schema
const registerSchema = z.object({
  companyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<RegisterFormData>({
    companyName: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      registerSchema.parse(formData);

      // Dispatch to Redux store
      dispatch(registerCompany(formData));

      // Show success message
      toast({
        title: "Registration Successful",
        description: "Your company information has been saved.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format
        const fieldErrors: Partial<RegisterFormData> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof RegisterFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ToastProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-slate-700 dark:text-primary">
            Register Your Company
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Name
                </div>
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </div>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </div>
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter company address"
                className={errors.address ? "border-red-500" : ""}
                rows={3}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Company"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </ToastProvider>
  );
}
