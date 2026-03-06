import React from 'react'
import { motion } from "framer-motion";
import { CheckCircle, X } from 'lucide-react';

interface RegisterSucessProps {
  setRegisterSucess: React.Dispatch<React.SetStateAction<boolean>>;
  congratulations?: string;
  text?: string;
}

export const RegisterSucess: React.FC<RegisterSucessProps> = ({ setRegisterSucess, congratulations, text }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-lg shadow-xl p-6 text-center w-full max-w-sm"
      >
        <X
          onClick={() => setRegisterSucess(false)}
          className="absolute right-4 top-4 w-5 h-5 text-gray-400 hover:text-black hover:cursor-pointer"
        />
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4 mt-2" />
        <p className="text-gray-700">
          {congratulations} <br /> {text}
        </p>
      </motion.div>
    </motion.div>
  );
}
