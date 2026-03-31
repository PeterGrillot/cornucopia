import NextLink from "next/link";
import { Link } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="p-3 w-[1024px] m-auto">
      <h1>Welcome to my sample app</h1>
      <ul>
        <li>
          <Link asChild>
            <NextLink href="/reviews">Reviews and sorting</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/tasks">Tasks and filtering</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/directory">Users Directory</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/products">Products</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/posts">Posts</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/onboarding">Onboarding</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/multistep-form">Multi-Step Form</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/rula">Rula Challenge</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/aclima">aclima Challenge</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/explorer">Explorer Challenge</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/nested-checkbox">
              nested-checkbox Challenge
            </NextLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <NextLink href="/price">Price Challenge</NextLink>
          </Link>
        </li>
      </ul>
    </main>
  );
}
