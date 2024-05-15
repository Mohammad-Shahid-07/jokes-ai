"use client";
import { updateUserImage } from '@/actions/user.actions';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ProfileUrls } from '@/lib/constant';
import { Loader } from 'lucide-react';

const ChooseAvatar = () => {
  const [loading, setLoading] = useState(false);

  const path = usePathname();
  const handleImageChange = async (img: string) => {
    try {
      setLoading(true);
      await updateUserImage({ image: img, path });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-[400px] rounded-md p-5 overflow-y-scroll bg-white custom-scrollbar ">
      <h2 className="font-bold text-2xl text-black/75  m-2 border-b-2 border-black/50">
        Choose An Image
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-10 transition-all ">
        {ProfileUrls.map((img) => (
          <div
            key={img}
            className="group relative h-20 w-20 overflow-hidden rounded-full"
          >
            <Image
              src={img}
              className="h-20 w-20 rounded-full transition-transform duration-300 ease-in-out group-hover:scale-110"
              alt="profile"
              width={120}
              height={120}
            />
            <div className="absolute bottom-2  opacity-100 transition-opacity duration-300">
              <button
                className="hover:bg-blue-500  w-20
              translate-y-12 rounded-full bg-blue-300 px-5 py-2.5 text-center
              text-sm 
              font-medium text-white  transition-all group-hover:translate-y-2"
                onClick={() => {
                  handleImageChange(img);
                }}
                disabled={loading}
              >
                {loading && (
                  <Loader className="animate-spin h-5 w-5 text-center ml-[10px]" />
                )}
                {!loading && <p className="text-xs">Choose</p>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseAvatar;