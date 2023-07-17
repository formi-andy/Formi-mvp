import Link from "next/link";

type Props = {};

const View = (props: Props) => {
  return (
    <div>
      <Link href="/record">
        Record
      </Link>
    </div>
  );
};

export default View;
