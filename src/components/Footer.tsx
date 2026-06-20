function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-bold text-2xl mb-4">
              SinhVienTools
            </h3>

            <p className="text-slate-400">
              Bộ công cụ miễn phí dành cho sinh viên Việt Nam.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Công cụ
            </h4>

            <ul className="space-y-2 text-slate-400">
              <li>Tính GPA</li>
              <li>GPA Tích Lũy</li>
              <li>Quy đổi điểm</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Liên hệ
            </h4>

            <p className="text-slate-400">
              support@sinhvientools.vn
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-slate-500">
          © 2026 SinhVienTools
        </div>
      </div>
    </footer>
  );
}

export default Footer;