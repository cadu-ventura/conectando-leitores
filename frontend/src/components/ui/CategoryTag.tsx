interface Props {
  text: string | string[];
}

export default function CategoryTag({ text }: Props) {
  return (
    <span
      className='
        inline-block
        rounded-lg
        bg-purple-100
        px-3 py-1
        text-xs
        font-semibold
        text-purple-700
        min-w-[80px]
        text-center
      '
    >
      {text}
    </span>
  );
}
