import React from "react";

const Footer = () => {
  return (
    <div className="mt-8">
      {" "}
      {/* Added margin-bottom to the container */}
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 fixed bottom-0 rounded-box shadow-lg">
        {" "}
        {/* Added horizontal margin and rounded corners */}
        <aside>
          <p className="text-sm">
            {" "}
            {/* Made text slightly smaller */}
            Copyright © {new Date().getFullYear()} - All right reserved by ACME
            Industries Ltd
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
