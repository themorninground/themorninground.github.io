# تفعيل الحسابات في The Morning Round

الحسابات جاهزة في كود الموقع، لكنها مطفأة لين يتعبى ملف `app/firebase-config.js`.

## 1. إنشاء المشروع
1. ادخل https://console.firebase.google.com بحساب Google حقك.
2. Add project، سمّه مثلًا `themorninground`. تقدر تطفي Google Analytics.
3. الخطة المجانية (Spark) تكفي، وما تحتاج بطاقة.

## 2. تطبيق الويب والإعدادات
1. في صفحة المشروع اضغط أيقونة الويب `</>`، وسمّه `site`. لا تفعّل Hosting.
2. يطلع لك كود فيه `firebaseConfig = { apiKey: ..., authDomain: ..., projectId: ..., ... }`.
3. انسخ الكائن (اللي بين القوسين { }) وأرسله لي، أو افتح `app/firebase-config.js` في GitHub وغيّر `null` إلى الكائن نفسه. هذي الإعدادات طبيعي تكون ظاهرة في كود أي موقع؛ الحماية تجي من القواعد في الخطوة 4.

## 3. طرق الدخول
1. Build ← Authentication ← Get started.
2. Sign-in method: فعّل **Google** و**Email/Password**.
3. Settings ← Authorized domains: أضف `themorninground.github.io`.

## 4. قاعدة البيانات والقواعد
1. Build ← Firestore Database ← Create database، اختر Production mode وأقرب منطقة متاحة.
2. تبويب Rules: امسح الموجود والصق محتوى ملف `firestore.rules` من المستودع، ثم Publish.
   القاعدة تسمح لكل شخص يقرا ويكتب ملفه هو فقط.

## وش ينحفظ
لكل مستخدم ملف واحد `users/<uid>` فيه: الاسم، والتقدم (المقالات اللي خلصها، والمفاهيم، والمحفوظات، والجمل المظللة، والأيام). كلمات السر عند Google، ما توصلنا.
