import React, {useState } from 'react'
import { useParams} from 'react-router-dom'
import { Breadcrumb } from '../../components'
const FAQ = () => {
  const { category } = useParams()
  const [faqs, setFaqs] = useState([
    {
      question: '1. What payment you accept?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      isOpen: false,
    },
    {
      question: '2. In what country can you deliver?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      isOpen: false,
    },
    {
      question: '3. What payments you accept?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      isOpen: false,
    },
  ]);

  const toggleAccordion = (index) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq, i) => ({
        ...faq,
        isOpen: i === index ? !faq.isOpen : false,
      }))
    );
  };

  return (
    <div className="container mx-auto">
      <div className='h-[81px] flex items-center justify-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>FAQs</h3>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-8 mt-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded p-4">
            <div
              className={`flex justify-between items-center cursor-pointer ${
                faq.isOpen ? 'bg-gray-200' : ''
              }`}
              onClick={() => toggleAccordion(index)}
            >
              <h4 className="font-600">{faq.question}</h4>
              <svg
                className={`w-5 h-5 transition-transform transform ${
                  faq.isOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {faq.isOpen && (
              <div className="mt-4">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;