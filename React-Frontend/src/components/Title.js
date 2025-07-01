import React from 'react'

const Title = (props) => {
  return (
    <div className="reveal-top head relative flex flex-col items-center justify-center py-10 text-center">
      <img 
        src="imges/Screenshot_2025-05-04_210646-removebg-preview.webp" 
        alt="" 
        className="block absolute left-[15px] md:left-20 top-1/4 -translate-y-1/2 w-[50px] md:w-[80px]"
        />
    
      <img 
        src="imges/Screenshot_2025-05-04_210646-removebg-preview.webp" 
        alt="" 
        className=" md:block absolute right-[15px] md:right-20 top-1/4 -translate-y-1/2 w-[50px] md:w-[80px]"
      />
    
      <h1 className="font-bold text-[25px] md:text-[30px] lg:text-[40px]">{props.name}</h1>
      <p className="text-[14px] md:text-[16px] leading-relaxed mt-2 font-bold">
        {props.description} </p>
    </div>
  )
}

export default Title
