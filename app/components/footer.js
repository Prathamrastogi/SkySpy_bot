export default function Footer() {
  return (
    <footer className="bg-white text-black text-center p-4 m-4 border border-black rounded-lg">
      © {new Date().getFullYear()} Telegram Bot Admin Panel
    </footer>
  );
}
