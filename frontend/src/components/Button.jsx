import { ArrowUpRight } from "lucide-react";

function Button({
  children,
  onClick,
  variant = "dark",
  className = "",
}) {
  const styles = {
    dark: "bg-[#171513] text-white hover:bg-[#b08d57]",
    light: "bg-white text-[#171513] hover:bg-[#b08d57] hover:text-white",
    outline:
      "border border-[#171513]/30 text-[#171513] hover:bg-[#171513] hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`
        group
        inline-flex
        items-center
        justify-center
        gap-4
        px-7
        py-3.5
        text-[10px]
        tracking-[0.22em]
        uppercase
        transition-all
        duration-500
        ${styles[variant]}
        ${className}
      `}
    >
      <span>{children}</span>

      <ArrowUpRight
        size={15}
        strokeWidth={1.4}
        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
      />
    </button>
  );
}

export default Button;