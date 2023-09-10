import Link from "next/link";
import React from "react";
import {
  AiFillFacebook,
  AiFillLinkedin,
  AiFillTwitterCircle,
  AiFillInstagram,
} from "react-icons/ai";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="space-y-4 px-4 md:px-8 w-full border-b py-4 mb-8 bg-black text-white mt-8">
      <div className="flex justify-between gap-x-4 relative">
        <div className="flex flex-col gap-y-4 text-white transition-all w-3/4">
          <p className="text-2xl">HomeScope</p>
          <div className="grid grid-cols-2 border-l border-white pl-4">
            <Link
              className="hover:decoration-white hover:underline"
              href="/about"
            >
              About
            </Link>
            <Link
              className="hover:decoration-white hover:underline"
              href="/terms"
            >
              Terms
            </Link>
            <Link
              className="hover:decoration-white hover:underline"
              href="/legal"
            >
              Legal
            </Link>
            <Link
              className="hover:decoration-white hover:underline"
              href="/support"
            >
              Support
            </Link>
            <Link
              className="hover:decoration-white hover:underline"
              href="/learn"
            >
              Learn More
            </Link>
            <Link
              className="hover:decoration-white hover:underline"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 absolute bottom-0 right-0">
          <div className="flex gap-x-4">
            <Link href="#">
              <AiFillFacebook
                size={24}
                className="hover:fill-white fill-slate-700 transition-all"
              />
            </Link>
            <Link href="#">
              <AiFillInstagram
                size={24}
                className="hover:fill-white fill-slate-700 transition-all"
              />
            </Link>
            <Link href="#">
              <AiFillTwitterCircle
                size={24}
                className="hover:fill-white fill-slate-700 transition-all"
              />
            </Link>
            <Link href="#">
              <AiFillLinkedin
                size={24}
                className="hover:fill-white fill-slate-700 transition-all"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
