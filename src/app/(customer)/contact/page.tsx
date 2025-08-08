"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Loader2, Star } from "lucide-react";
import { ErrorResponse } from "@/utils/ErrorResponse";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { contactSchema } from "@/schemas/contactSchema";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  const form = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleContactSubmit = async (data: ContactFormInputs) => {
    setIsSubmitting(true);

    if (!session) {
      setIsSubmitting(false);
      toast.error("Please sign in to contact us.");
      router.push("/sign-in");
      return;
    }

    data = {
      ...data,
      user: session.user._id,
    };

    try {
      const response = await axios.post("/api/contact", data);
      toast.success(response.data.message, { duration: 5000 });
      form.reset();
      router.replace("/");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "An error occurred while sending your message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to render star icons based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-[#efa765] fill-[#efa765]" : "text-gray-400"}`}
        />
      );
    }
    return <div className="flex justify-center mb-4">{stars}</div>;
  }; // Effect to fetch reviews when the component mounts

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("hello before backend");
        const response = await axios.get("/api/approved-reviews");
        console.log(response.data);
        console.log("hello after backend");
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setErrorReviews("Failed to load reviews. Please try again later.");
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-dark-background font-sans overflow-hidden">
        <div className="absolute inset-0 bg-dark-background/80 z-10"></div>

        <div className="relative z-20 max-w-5xl w-full bg-card-background/90 backdrop-blur-sm p-8 md:p-12  overflow-hidden transform transition-all duration-300">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-accent-red to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-transparent via-accent-red to-transparent"></div>

          <h1 className="second-heading font-yeseva-one text-fast-food-orange text-80px leading-112px text-center mb-8 md:mb-12 drop-shadow-lg">
            Contact Us
          </h1>
          <div className="text-center mb-12 space-y-4">
            <p className="third-heading font-yeseva-one text-fast-food-orange text-3xl-plus leading-tight drop-shadow-sm">
              Every message is a valued connection.
            </p>
            <p className="text-[#efa765] text-text-light text-lg italic font-sans opacity-90">
              We are here to listen, assist, and ensure your experience with us
              is nothing short of exceptional. Reach out with anything on your
              heart – we are ready to care ❤
            </p>
          </div>
          <p className="text-[#efa765] text-center text-text-light text-lg md:text-xl mb-12 font-sans font-light max-w-3xl mx-auto">
            Have a question, feedback, or special request? We love to hear from
            you!
          </p>

          {/* Two-column layout for Contact Info and Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left Column: Contact Information */}
            <div className="bg-input-bg p-8 rounded-2xl border border-[#efa765] shadow-lg flex flex-col justify-between">
              <div>
                <h2 className="font-yeseva-one text-fast-food-orange text-3xl-plus mb-6 text-center text-[#efa765] font-bold">
                  Contact Info
                </h2>
                <div className="space-y-6 text-text-light text-lg">
                  <p>
                    <span className="font-semibold text-[#efa765]">
                      Address:
                    </span>
                    <br />
                    <span className="text-white">
                      1234 N Spring St, Sahiwal, Punjab, Pakistan
                    </span>{" "}
                    {/* Updated address text */}
                  </p>
                  <p>
                    <span className="font-semibold text-[#efa765]">Phone:</span>
                    <br />
                    <a
                      href="tel:+1234567890"
                      className="text-white transition-colors"
                    >
                      +92320-1234567
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-[#efa765]">Email:</span>
                    <br />
                    <a
                      href="mailto:info@luminous.com"
                      className="text-white transition-colors"
                    >
                      info@luminous.com
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-[#efa765]">Hours:</span>
                    <br />
                    <span className="text-white">
                      Mon - Fri: 11 AM - 10 PM
                      <br />
                      Sat - Sun: 12 PM - 11 PM
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-input-bg p-8 rounded-2xl border border-[#efa765] shadow-lg">
              <h2 className="font-yeseva-one text-3xl-plus mb-6 text-center text-[#efa765] font-bold">
                Send Us a Message
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleContactSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[#efa765] text-sm font-sans mb-2">
                          Your Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            required
                            className="text w-full py-2.5 px-4 bg-card-background border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[#efa765] text-sm font-sans mb-2">
                          Your Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                            required
                            className="text w-full py-2.5 px-4 bg-card-background border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[#efa765] text-sm font-sans mb-2">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Regarding reservation / Feedback / Inquiry"
                            required
                            {...field}
                            className="text w-full py-2.5 px-4 bg-card-background border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[#efa765] text-sm font-sans mb-2">
                          Your Message
                        </FormLabel>
                        <FormControl>
                          <textarea
                            rows={5}
                            placeholder="Type your message here..."
                            {...field}
                            required
                            className="text w-full py-2.5 px-4 bg-card-background border border-border-dark rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red transition-all duration-200 focus:animate-red-glow resize-y"
                          ></textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full py-3 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md"
                    style={{
                      backgroundColor: "rgb(239, 167, 101)",
                      color: "rgb(20, 31, 45)",
                    }}
                    disabled={isSubmitting} // Use isSubmitting state
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
              <div className="text-center mt-8">
                <p className="text-white text-md font-sans mb-4">
                  Loved your experience? Leave us a review!
                </p>
                <Link href="/reviews" passHref className="w-full block">
                  <Button
                    asChild
                    className="w-full py-3 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md block"
                    style={{
                      backgroundColor: "rgb(239, 167, 101)",
                      color: "rgb(20, 31, 45)",
                    }}
                  >
                    Submit a Review
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="second-heading mt-12 text-80px leading-112px text-center mb-2 md:mb-4 drop-shadow-lg">
        Location & Reviews
      </h1>
      <div className="mt-8 md:mt-10 flex flex-col lg:flex-row justify-evenly items-stretch gap-10 lg:gap-16 rounded-3xl p-4">
        {/* Left Column: Google Map Section */}

        <div className="flex-1 p-8 rounded-2xl bg-card-background/90 backdrop-blur-sm shadow-2xl border border-[#efa765]">
          {" "}
          <h2 className="third-heading text-center mb-8">Find Us on the Map</h2>
          <div
            className="relative overflow-hidden rounded-xl"
            style={{ paddingTop: "56.25%" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109280.9930776735!2d73.34446332766606!3d30.677894178550134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392263b65f324151%3A0x7d2873822187f540!2sSahiwal%2C%20Sahiwal%20District%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, position: "absolute", top: 0, left: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Luminous Bistro Location in Sahiwal, Pakistan" /* Updated title */
            ></iframe>
          </div>
          <p className="text-center text text-sm mt-6 font-sans">
            Visit us at our exquisite location in the heart of Sahiwal,
            Pakistan. 
          </p>
        </div>
        <div className="flex-1 p-8 rounded-2xl bg-card-background/90 backdrop-blur-sm shadow-2xl border border-[#efa765] flex flex-col justify-between w-1/2">
          <div>
                     
            <h2 className="third-heading text-center mb-6">
              What Our Guests Say
            </h2>
            {isLoadingReviews && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-fast-food-orange" />
                     
              </div>
            )}
            {errorReviews && (
              <p className="text-center text-red-500 font-semibold text-lg">
                {errorReviews}
              </p>
            )}
            {!isLoadingReviews && !errorReviews && reviews.length === 0 && (
              <p className="text-center text-gray-400 font-light text-xl mt-16">
                No reviews to display yet.
              </p>
            )}
            {!isLoadingReviews && reviews.length > 0 && (
              <Carousel
                plugins={[Autoplay({ delay: 3000 })]}
                className="w-full h-full"
              >
                <CarouselContent>
                  {reviews.map((review) => (
                    <CarouselItem key={review._id}>
                      <div className="text-center p-4">
                        {renderStars(review.rating)}   
                        <p className="text-white italic text-lg mb-3">
                          {review.review}                        
                        </p>
                                   
                        <p className="text-[#efa765] font-semibold">
                          - {review.name}
                        </p>{" "}
                                       
                      </div>
                                   
                    </CarouselItem>
                  ))}
                       
                </CarouselContent>
              </Carousel>
            )}
          </div>
          <div className="mt-8">
            <p className="text-white text-md font-sans mb-4 text-center">
              Ready to leave your own feedback?
            </p>
            <Link href="/reviews">
              <Button
                className="w-full py-3 rounded-lg font-semibold text-lg hover:cursor-pointer shadow-md"
                style={{
                  backgroundColor: "rgb(239, 167, 101)",
                  color: "rgb(20, 31, 45)",
                }}
              >
                Submit a Review
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
