import React from 'react';

const WordCloudSection = () => {
  return (
    <section className="bg-[#FAF6F0] px-4 py-8">
      <div className="max-w-screen-lg mx-auto">
        {/* Text Content */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            A thriving community of young professionals with an average age of 30, bringing together diverse talents across Silicon Valley's tech ecosystem.
          </p>
        </div>

        {/* Image Container */}
        <div className="w-1/3 mx-auto">
          <div className="bg-transparent overflow-hidden relative">
            <img
              src={process.env.PUBLIC_URL + "/images/picture/wordcloud.svg"}
              alt="Word Cloud Visualization"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WordCloudSection;