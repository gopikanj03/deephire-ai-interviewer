import { SignIn } from "@clerk/nextjs"

 function Page() {
  return ( 
  <div>
    <header><img
        alt=""
        src={'/deep.svg'}  
        className=" inset-0  p-2"
      /></header>
  

<section className="bg-white dark:bg-gray-900">
<h1 className=" flex items-center justify-center mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
          Welcome to AI-INTERVIEWER
        </h1>
        <p className="flex items-center justify-center mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
        Hey! avatar is waiting ,go sharpen your skills and build confidence with personalized, interactive mock interviews tailored just for you!"
        </p>
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
    <img
  alt=""
  src={'/Tengai-with-products-min.jpg'}
  className="absolute  h-5/6 w-auto  right-14 object-cover"
/>
    </aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        <a className="block text-blue-600" href="#">
          <span className="sr-only">Home</span>
          
        </a>

      

       

        <SignIn    />
      </div>
    </main>
  </div>
</section>
</div>
)
}

export default Page