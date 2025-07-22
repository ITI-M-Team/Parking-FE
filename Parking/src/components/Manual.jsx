import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext"; 

const Manual = () => {
  const { language } = useLanguage(); 

  
  const t = {
    en: {
      title: "User Guide: Smart Parking App",
      sections: {
        register: {
          title: "1. Register and Verify Your Account",
          content: (
            <>
              Start by selecting your role: <strong>Driver</strong> or <strong>Garage Owner</strong>.
              You’ll need to upload verification documents:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Drivers</strong>: Driver's License & Car License</li>
                <li><strong>Garage Owners</strong>: National ID</li>
                <li>Account status will be “Pending Verification” until approved.</li>
              </ul>
            </>
          ),
        },
        login: {
          title: "2. Login & Manage Your Session",
          content: (
            <>
              Log in with your email and password. Use “Remember Me” to stay signed in.
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Drivers</strong> are taken to their dashboard.</li>
                <li><strong>Garage Owners</strong> go to their management panel.</li>
              </ul>
            </>
          ),
        },
        book: {
          title: "3. Book a Parking Spot (Driver)",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use the map to find garages near your location or search destination.</li>
              <li>View hourly rates, ratings, and availability.</li>
              <li>Select a spot, pick arrival time, and click “Book Now.”</li>
              <li>Booking confirmation shows a timer and booking summary.</li>
            </ul>
          ),
        },
        qr: {
          title: "4. Use QR Code for Access",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>After booking, a unique QR code is generated.</li>
              <li>Scan at garage gate to check-in/out.</li>
              <li>Status and times are updated automatically.</li>
            </ul>
          ),
        },
        payment: {
          title: "5. Make Payments & Manage Wallet",
          content: (
            <>
              <p className="font-medium mb-1">Drivers:</p>
              <ul className="list-disc list-inside mb-3 space-y-1">
                <li>Top-up using Visa, Fawry, Vodafone Cash, etc.</li>
                <li>Pay bookings automatically from wallet.</li>
                <li>View all transactions in your wallet page.</li>
              </ul>
              <p className="font-medium mb-1">Garage Owners:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Track revenue and active bookings.</li>
                <li>Request payouts to bank accounts.</li>
              </ul>
            </>
          ),
        },
        dashboard: {
          title: "6. Manage Your Dashboard",
          content: (
            <>
              <p className="font-medium mb-1">Drivers:</p>
              <ul className="list-disc list-inside mb-3 space-y-1">
                <li>Track bookings and history.</li>
                <li>Cancel bookings (with possible penalty).</li>
                <li>Rate garages after visits.</li>
              </ul>
              <p className="font-medium mb-1">Garage Owners:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Add/manage garages and pricing.</li>
                <li>Monitor live occupancy.</li>
                <li>View reviews and adjust availability.</li>
              </ul>
            </>
          ),
        },
        reset: {
          title: "7. Reset Your Password",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Click “Forgot Password” on the login page.</li>
              <li>Choose email or phone for OTP delivery.</li>
              <li>Enter OTP, then set a new password.</li>
            </ul>
          ),
        },
        profile: {
          title: "8. Profile & Settings",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Update your name and phone.</li>
              <li>Change your password.</li>
              <li>Switch between Light and Dark Mode.</li>
            </ul>
          ),
        },
        security: {
          title: "9. Security & Notifications",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All data is encrypted and securely stored.</li>
              <li>You’ll be notified about bookings, receipts, and verification updates.</li>
            </ul>
          ),
        },
        roles: {
          title: "10. Admin & Employee Roles",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Admins</strong> verify uploaded documents and activate accounts.</li>
              <li><strong>Employees</strong> scan QR codes at gates and track entries/exits.</li>
            </ul>
          ),
        },
      },
    },
    ar: {
      title: "دليل المستخدم: تطبيق وقوف السيارات الذكي",
      sections: {
        register: {
          title: "١. التسجيل والتحقق من الحساب",
          content: (
            <>
              ابدأ باختيار دورك: <strong>سائق</strong> أو <strong>مالك جراج</strong>.
              ستحتاج إلى رفع وثائق التحقق:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>السائقين</strong>: رخصة القيادة ورخصة السيارة</li>
                <li><strong>مالكي الجراجات</strong>: بطاقة الهوية الوطنية</li>
                <li>سيكون حالة الحساب "في انتظار التحقق" حتى يتم الموافقة عليه.</li>
              </ul>
            </>
          ),
        },
        login: {
          title: "٢. تسجيل الدخول وإدارة الجلسة",
          content: (
            <>
              سجل الدخول باستخدام بريدك الإلكتروني وكلمة المرور. استخدم خيار "تذكيري" للبقاء مسجلاً.
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>السائقين</strong>: يتم توجيهك إلى لوحة القيادة الخاصة بك.</li>
                <li><strong>مالكي الجراجات</strong>: تنتقل إلى لوحة الإدارة.</li>
              </ul>
            </>
          ),
        },
        book: {
          title: "٣. حجز مكان وقوف (للسائقين)",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>استخدم الخريطة للعثور على الجراجات القريبة من موقعك أو ابحث عن الوجهة.</li>
              <li>اطلع على أسعار الساعة والمراجعات والتوفر.</li>
              <li>اختر مكانًا، وحدد وقت الوصول، ثم انقر على "احجز الآن".</li>
              <li>تظهر تفاصيل الحجز مع مؤقت وملخص الحجز.</li>
            </ul>
          ),
        },
        qr: {
          title: "٤. استخدام رمز الاستجابة السريعة (QR Code) للدخول",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>بعد الحجز، يتم إنشاء رمز QR فريد.</li>
              <li>امسح الرمز عند بوابة الجراج للدخول أو الخروج.</li>
              <li>يتم تحديث الحالة والأوقات تلقائيًا.</li>
            </ul>
          ),
        },
        payment: {
          title: "٥. إجراء المدفوعات وإدارة المحفظة",
          content: (
            <>
              <p className="font-medium mb-1">السائقين:</p>
              <ul className="list-disc list-inside mb-3 space-y-1">
                <li>قم بإضافة رصيد عبر فيزا أو فوري أو فودافون كاش.</li>
                <li>ادفع الحجوزات تلقائيًا من المحفظة.</li>
                <li>اعرض جميع العمليات في صفحة المحفظة.</li>
              </ul>
              <p className="font-medium mb-1">مالكي الجراجات:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>تتبع الإيرادات والحجوزات النشطة.</li>
                <li>اطلب التحويلات إلى الحساب البنكي.</li>
              </ul>
            </>
          ),
        },
        dashboard: {
          title: "٦. إدارة اللوحة الشخصية",
          content: (
            <>
              <p className="font-medium mb-1">السائقين:</p>
              <ul className="list-disc list-inside mb-3 space-y-1">
                <li>تتبع الحجوزات والسجلات.</li>
                <li>إلغاء الحجوزات (مع احتمال وجود غرامة).</li>
                <li>تقييم الجراجات بعد الزيارة.</li>
              </ul>
              <p className="font-medium mb-1">مالكي الجراجات:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>أضف/قم بإدارة الجراجات والتسعير.</li>
                <li>راقب الإشغال في الوقت الفعلي.</li>
                <li>اعرض المراجعات وقم بتعديل التوافر.</li>
              </ul>
            </>
          ),
        },
        reset: {
          title: "٧. إعادة تعيين كلمة المرور",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>انقر على "نسيت كلمة المرور" في صفحة تسجيل الدخول.</li>
              <li>اختر البريد الإلكتروني أو الهاتف لتلقي رمز التحقق المؤقت (OTP).</li>
              <li>أدخل الرمز، ثم حدد كلمة مرور جديدة.</li>
            </ul>
          ),
        },
        profile: {
          title: "٨. الملف الشخصي والإعدادات",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>قم بتحديث اسمك وهاتفك.</li>
              <li>غيّر كلمة المرور.</li>
              <li>انتقل بين الوضع النهاري والليلي.</li>
            </ul>
          ),
        },
        security: {
          title: "٩. الأمان والإشعارات",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>جميع البيانات مشفرة ومُخزنة بشكل آمن.</li>
              <li>ستتلقى إشعارات حول الحجوزات والمستندات وتحديثات التحقق.</li>
            </ul>
          ),
        },
        roles: {
          title: "١٠. أدوار المشرف والموظف",
          content: (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>المشرفين</strong>: يتحققون من الوثائق المرفوعة ويُنشئون الحسابات.</li>
              <li><strong>الموظفين</strong>: يمسحون الرمز عند البوابات ويتابعون عمليات الدخول والخروج.</li>
            </ul>
          ),
        },
      },
    },
  };

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">
            {t[language].title}
          </h1>
          <div className="space-y-10">
            {Object.values(t[language].sections).map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-3">
                  {section.title}
                </h2>
                <div className="text-base leading-relaxed">{section.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Manual;