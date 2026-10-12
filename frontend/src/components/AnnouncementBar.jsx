import { motion } from "framer-motion";

function AnnouncementBar() {
  return (
    <div className="bg-[#171513] text-white overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap py-2.5"
      >
        <div className="flex items-center gap-12 px-6 text-[10px] tracking-[0.3em] uppercase">
          <span>Complimentary shipping on orders above ₹10,000</span>
          <span className="text-[#b08d57]">✦</span>
          <span>Discover timeless elegance</span>
          <span className="text-[#b08d57]">✦</span>
          <span>Crafted for your story</span>
          <span className="text-[#b08d57]">✦</span>
          <span>Complimentary shipping on orders above ₹10,000</span>
          <span className="text-[#b08d57]">✦</span>
          <span>Discover timeless elegance</span>
        </div>
      </motion.div>
    </div>
  );
}

export default AnnouncementBar;