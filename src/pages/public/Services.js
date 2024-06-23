import React, {useState } from 'react'
import { useParams} from 'react-router-dom'
import { Breadcrumb } from '../../components'
const Services = () => {
  const { category } = useParams()
  const services = [
    {
      title: 'Free Shipping',
      description: 'Enjoy free shipping on all orders within the country. No minimum purchase required.',
      icon: 'fas fa-truck',
    },
    {
      title: '24/7 Customer Support',
      description: 'Our dedicated customer support team is available 24/7 to assist you with any queries or concerns.',
      icon: 'fas fa-headset',
    },
    {
      title: 'Easy Returns',
      description: 'Not satisfied with your purchase? We offer hassle-free returns within 30 days of delivery.',
      icon: 'fas fa-undo',
    },
  ];

  return (
    <div>
      <div className='h-[81px] flex items-center justify-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>Our Services</h3>
          <Breadcrumb category={category} />
        </div>
      </div>
    <section className="bg-gray-100 py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-500">
          Welcome to our "Our Services" page! We are proud to bring you leading services in the field of technology sales. With a team of experienced professionals and a commitment to quality, we are committed to providing you with a great shopping experience and outstanding customer service.
          </p>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {services.map((service, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <i className={`text-white ${service.icon}`}></i>
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
            </div>
  );
};

export default Services;