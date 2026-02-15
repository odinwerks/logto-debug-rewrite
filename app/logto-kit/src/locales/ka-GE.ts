import type { Translations } from './index';

export const kaGE: Translations = {
  // Dashboard
  dashboard: {
    title: 'LOGTO DEBUG DASHBOARD',
    version: 'v3.4',
    loading: '[მომხმარებლის მონაცემების ჩატვირთვა...]',
    error: '[შეცდომა]',
    refresh: '[განახლება]',
    signOut: '[გასვლა]',
    session: 'სესია',
    processing: '[დამუშავება...]',
    systemMessage: '[სისტემა] ეს დებაგ ინსტრუმენტი მხოლოდ ALPHA-ს ფაზაშია. შეიძლება თავად იყოს ბაგი. გაერთეთ.',
  },
  
  // Terminal header
  terminal: {
    prompt: 'user@logto-debug:~$',
    command: 'sudo userinfo --verbose --edit',
  },
  
  // Tabs
  tabs: {
    profile: 'მომხმარებელი',
    customData: 'CUSTOM',
    identities: 'იდენტიტეტები',
    organizations: 'ორგანიზაციები',
    mfa: 'MFA',
    raw: 'RAW',
  },
  
  // Sidebar
  sidebar: {
    profileAvatar: 'პროფილის ავატარი',
    noAvatar: 'ავატარი\nარაა',
    token: 'ტოკენი',
    userId: 'მომხმარებლის ID',
    lastLogin: 'ბოლო შესვლა',
    lightMode: '[ნათელი რეჟიმი]',
    darkMode: '[მუქი რეჟიმი]',
  },
  
  // Profile tab
  profile: {
    userProfile: 'მომხმარებლის პროფილი',
    basicInfo: 'ძირითადი ინფორმაცია',
    editingProfile: 'პროფილის რედაქტირება',
    givenName: 'სახელი',
    familyName: 'გვარი',
    username: 'მომხმარებლის სახელი',
    email: 'ელფოსტა',
    phone: 'ტელეფონი',
    name: 'სახელი',
    editProfile: '[პროფილის რედაქტირება]',
    saveProfile: '[პროფილის შენახვა]',
    saving: '[ინახება...]',
    cancel: '[გაუქმება]',
    add: '[დამატება]',
    edit: '[რედაქტირება]',
    remove: '[წაშლა]',
    null: 'null',
    notSet: '(არ არის მითითებული)',
    avatarUrl: 'ავატარის URL',
    editAvatarUrl: '[ავატარის URL-ის რედაქტირება]',
  },
  
  // Verification
  verification: {
    password: 'პაროლი',
    verifyPassword: '[პაროლის შემოწმება]',
    verificationCode: 'კოდი',
    verifyCode: '[კოდის შემოწმება]',
    codeSent: 'კოდი გამოგზავნილია',
  },
  
  // Custom Data tab
  customData: {
    title: 'CUSTOM მონაცემები',
    editing: 'CUSTOM მონაცემების რედაქტირება',
    jsonData: 'JSON მონაცემები',
    editCustomData: '[CUSTOM მონაცემების რედაქტირება]',
    save: '[შენახვა]',
    empty: '[ცარიელი]',
    noCustomData: 'CUSTOM მონაცემები არ მოიძებნა',
    invalidJson: 'არასწორი JSON',
    mustBeObject: 'უნდა იყოს JSON ობიექტი',
  },
  
  // Identities tab
  identities: {
    title: 'იდენტიტეტები',
    noIdentities: 'გარე იდენტიტეტები არ არის დაკავშირებული',
  },
  
  // Organizations tab
  organizations: {
    title: 'ორგანიზაციები',
    orgs: 'ორგანიზაციები',
    orgRoles: 'ორგანიზაციის როლები',
    noOrganizations: 'არ არის ორგანიზაციის წევრი',
    noRoles: 'ორგანიზაციის როლები არ არის მინიჭებული',
  },
  
  // MFA tab
  mfa: {
    title: 'მრავალფაქტორიანი აუთენტიფიკაცია',
    enrolledFactors: 'დარეგისტრირებული ფაქტორები',
    noFactors: '[MFA ფაქტორები არ არის დარეგისტრირებული]',
    enrollNewFactor: 'ახალი ფაქტორის დარეგისტრირება',
    totp: 'TOTP',
    totpDescription: '(აუთენტიფიკატორის აპლიკაცია)',
    authenticatorApp: 'აუთენტიფიკატორის აპლიკაცია',
    generateTotpSecret: '[TOTP საიდუმლოს გენერაცია]',
    scanQrCode: 'სკანირება QR კოდი თქვენი აუთენტიფიკატორის აპლიკაციით:',
    cantScan: 'ვერ სკანირებთ?',
    enterManually: 'შეიყვანეთ ეს საიდუმლო ხელით თქვენს აუთენტიფიკატორის აპლიკაციაში.',
    enterCodeFromApp: 'შეიყვანეთ 6-ნიშნა კოდი აპლიკაციიდან',
    verifyAndEnroll: '[შემოწმება & რეგისტრაცია]',
    backupCodes: 'სარეზერვო კოდები',
    generateNewCodes: '[ახალი კოდების გენერაცია]',
    viewExisting: '[არსებულის ნახვა]',
    saveTheseCodes: 'შეინახეთ ეს კოდები - თითოეული მხოლოდ ერთხელ გამოიყენება:',
    existingCodes: 'არსებული სარეზერვო კოდები:',
    codesLeft: 'დარჩენილი კოდები',
    downloadTxt: '[.TXT-ის ჩამოტვირთვა]',
    downloadHtml: '[.HTML-ის ჩამოტვირთვა]',
    finishAndSave: '[დასრულება & შენახვა]',
    hide: '[დამალვა]',
    webauthn: 'WEBAUTHN',
    webauthnDescription: '(Passkey) - WebAuthn-ის რეგისტრაციას საჭიროებს ბრაუზერის API ინტეგრაცია. გამოიყენეთ მოწყობილობის ბიომეტრია ან უსაფრთხოების გასაღებები.',
    enrollWebauthn: '[WEBAUTHN-ის რეგისტრაცია]',
    remove: '[წაშლა]',
    created: 'შექმნილი',
    lastUsed: 'ბოლოს გამოყენებული',
  },
  
  // Raw tab
  raw: {
    title: 'RAW',
    rawUserData: 'RAW მომხმარებლის მონაცემები',
  },
  
  // Common
  common: {
    copy: 'კოპირება',
    copied: 'დაკოპირებულია!',
    close: '[დახურვა]',
    success: '[წარმატება]',
    error: '[შეცდომა]',
    loading: '[...]',
    retry: '[თავიდან ცდა]',
  },
};

export default kaGE;
