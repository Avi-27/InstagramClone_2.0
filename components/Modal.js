import { useRecoilState } from "recoil";
import { modalstate } from "../atoms/modalAtoms";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { signIn, signOut, useSession } from "next-auth/react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
function Modal() {
  const [open, setOpen] = useRecoilState(modalstate);
  const filePickerRef = useRef(null);
  const captionRef = useRef("");
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);
    // 1)create a post and add to firestore
    // 2) get the post id for the newly created post
    // 3)upload the image to firebase storage
    // 4) get the image url for the newly uploaded image and update the original post
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImage: session.user.image,
      timestamp: serverTimestamp(),
    });
    console.log("new post added with id", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/images`);

    await uploadString(imageRef, selectedFile, "data_url").then(async (snapshot) => {
      const downloadURL = await getDownloadURL(imageRef);
      const fileRef = doc(db, "posts", docRef.id);
      await updateDoc(fileRef, {
        image: downloadURL,
      });
    });
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overscroll-auto" onClose={setOpen}>
        <div className="flex items-center justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pd-5 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                    alt=""
                    className="w-full object-contain cursor-pointer"
                  />
                ) : (
                  <div
                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                    onClick={() => filePickerRef.current.click()}
                  >
                    <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                )}

                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    {selectedFile ? "Nice!!" : "Upload Image"}
                  </Dialog.Title>

                  <div>
                    <input type="file" hidden ref={filePickerRef} onChange={addImageToPost} />
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      ref={captionRef}
                      placeholder="Enter a caption"
                      className="border-none focus:ring-0 w-full text-center"
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    disabled={!selectedFile}
                    className="inline-flex justify-center w-full rounded-md border border-transparent hover:bg-red-500 focus:outline-none focus:ring-offset-2  focus:ring-red-500 sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed p-2 font-bold focus:ring-2 bg-red-500 hover:disabled:bg-gray-100 text-white"
                    type="button"
                    onClick={uploadPost}
                  >
                    {loading ? "Uploading" : "Upload Post"}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;
