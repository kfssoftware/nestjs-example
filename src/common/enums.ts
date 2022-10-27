export enum UserType {
  Admin = 1,
  User = 2,
  ChefUser = 3,
  Place = 4
}

export const UserTypeLabel = new Map<number, string>([
  [UserType.Admin, 'enum.user_type.admin'],
  [UserType.User, 'enum.user_type.user'],
  [UserType.ChefUser, 'enum.user_type.chef_user'],
  [UserType.Place, 'enum.user_type.place_user'],
]);

export enum PackageTypeEnum {
  Basic = 1,
  Gold = 2,
  Premium = 3
}

export const PackageTypeEnumLabel = new Map<number, string>([
  [PackageTypeEnum.Basic, 'enum.package_type.basic'],
  [PackageTypeEnum.Gold, 'enum.package_type.gold'],
  [PackageTypeEnum.Premium, 'enum.package_type.premium']
]);

export enum PlaceType {
  Restaurant = 1,
  Cafe = 2,
  Blogger = 3,
  Vlogger = 4,
  Reputed = 5
}

export const PlaceTypeLabel = new Map<number, string>([
  [PlaceType.Restaurant, 'enum.place_type.restaurant'],
  [PlaceType.Cafe, 'enum.place_type.cafe'],
  [PlaceType.Blogger, 'enum.place_type.blogger'],
  [PlaceType.Vlogger, 'enum.place_type.vlogger'],
  [PlaceType.Reputed, 'enum.place_type.reputed']
]);

export enum QuantityType {
  Gram = 1,
  Kilogram = 2,
  Piece = 3,
  Bunch = 4,
  Pinch = 5,
}

export const QuantityTypeLabel = new Map<number, string>([
  [QuantityType.Gram, 'enum.quantity_type.gram'],
  [QuantityType.Kilogram, 'enum.quantity_type.kilogram'],
  [QuantityType.Piece, 'enum.quantity_type.piece'],
  [QuantityType.Bunch, 'enum.quantity_type.bunch'],
  [QuantityType.Pinch, 'enum.quantity_type.pinch']
]);

export enum ServiceType {
  Person = 1,
  Jar = 2,
  Serving = 3,
  Sachet = 4,
  Liter = 5,
  Glass = 6,
  Milliliter = 7,
}

export const ServiceTypeLabel = new Map<number, string>([
  [ServiceType.Person, 'enum.service_type.person'],
  [ServiceType.Jar, 'enum.service_type.jar'],
  [ServiceType.Serving, 'enum.service_type.serving'],
  [ServiceType.Sachet, 'enum.service_type.sachet'],
  [ServiceType.Liter, 'enum.service_type.liter'],
  [ServiceType.Glass, 'enum.service_type.glass'],
  [ServiceType.Milliliter, 'enum.service_type.milliliter'],
]);

export enum TimeType {
  Second = 1,
  Minute = 2,
  Hour = 3,
  Day = 4,
}

export const TimeTypeLabel = new Map<number, string>([
  [TimeType.Second, 'enum.time_type.second'],
  [TimeType.Minute, 'enum.time_type.minute'],
  [TimeType.Hour, 'enum.time_type.hour'],
  [TimeType.Day, 'enum.time_type.day'],
]);

export enum DocumentType {
  Certificates = 1,
  Category = 2,
  ProfilePhotos = 3,
  Recipe = 4,
  Product = 5,
  Activity = 6
}

export const DocumentTypeLabel = new Map<number, string>([
  [DocumentType.Certificates, 'enum.document_type.certificates'],
  [DocumentType.Category, 'enum.document_type.category']
]);

export enum Status {
  Active = 1,
  Passive = 2,
  Deleted = 3,
}

export const StatusLabel = new Map<number, string>([
  [Status.Active, 'enum.status.active'],
  [Status.Passive, 'enum.status.passive'],
  [Status.Deleted, 'enum.status.deleted'],
]);

export enum OrderBy {
  Id = 1,
  CreatedDate = 2,
  Name = 3,
}

export const OrderByLabel = new Map<number, string>([
  [OrderBy.Id, 'enum.order_by.id'],
  [OrderBy.CreatedDate, 'enum.order_by.created_date'],
  [OrderBy.Name, 'enum.order_by.name'],
]);

export enum MapItemType {
  Activity = 0,
  Place = 1,
}

export const MapItemLabel = new Map<number, string>([
  [MapItemType.Activity, 'enum.map_item.activity'],
  [MapItemType.Place, 'enum.map_item.place'],
]);


export enum YesNo {
  No = 0,
  Yes = 1,
}

export const YesNoLabel = new Map<number, string>([
  [YesNo.Yes, 'enum.yes_no.yes'],
  [YesNo.No, 'enum.yes_no.no'],
]);

export enum PhotoType {
  Promotion = 1,
  Place = 2,
  After = 3
}

export const PhotoTypeLabel = new Map<number, string>([
  [PhotoType.Promotion, 'enum.photo_type.promotion'],
  [PhotoType.Place, 'enum.photo_type.place'],
  [PhotoType.After, 'enum.photo_type.after']
]);

export enum MonthEnum {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export const MonthEnumLabel = new Map<number, string>([
  [MonthEnum.January, '01'],
  [MonthEnum.February, '02'],
  [MonthEnum.March, '03'],
  [MonthEnum.April, '04'],
  [MonthEnum.May, '05'],
  [MonthEnum.June, '06'],
  [MonthEnum.July, '07'],
  [MonthEnum.August, '08'],
  [MonthEnum.September, '09'],
  [MonthEnum.October, '10'],
  [MonthEnum.November, '11'],
  [MonthEnum.December, '12']
]);

export enum YearEnum {
  Year_2022 = 1,
  Year_2023 = 2,
  Year_2024 = 3,
  Year_2025 = 4,
  Year_2026 = 5,
  Year_2027 = 6,
  Year_2028 = 7,
  Year_2029 = 8,
  Year_2030 = 9,
  Year_2031 = 10,
  Year_2032 = 11,
  Year_2033 = 12,
}

export const YearEnumLabel = new Map<number, string>([
  [YearEnum.Year_2022, '2022'],
  [YearEnum.Year_2023, '2023'],
  [YearEnum.Year_2024, '2024'],
  [YearEnum.Year_2025, '2025'],
  [YearEnum.Year_2026, '2026'],
  [YearEnum.Year_2027, '2027'],
  [YearEnum.Year_2028, '2028'],
  [YearEnum.Year_2029, '2029'],
  [YearEnum.Year_2030, '2030'],
  [YearEnum.Year_2031, '2031'],
  [YearEnum.Year_2032, '2032'],
  [YearEnum.Year_2033, '2033']
]);

export enum NotificationType {
  NoAction = 1,
  NewOrders = 2,
  CustomerRecipeConfirm = 3,
  RecipeerRecipeComplete = 4,
  OfferConfirm = 5,
  OfferIsGiven = 6,
  OfferCancel = 7
}
export const NotificationTypeLabel = new Map<number, string>([
  [NotificationType.NoAction, 'enum.notification_type.no_action'],
  [NotificationType.NewOrders, 'enum.notification_type.new_orders'],
  [NotificationType.CustomerRecipeConfirm, 'enum.notification_type.customer_Recipe_confirm'],
  [NotificationType.RecipeerRecipeComplete, 'enum.notification_type.Recipeer_Recipe_complete'],
  [NotificationType.OfferConfirm, 'enum.notification_type.offer_confirm'],
  [NotificationType.OfferIsGiven, 'enum.notification_type.offer_is_given'],
  [NotificationType.OfferCancel, 'enum.notification_type.offer_cancel'],
]);

export enum RoleActionEnum {
  Role = 100,
  RoleList = 101,
  RoleCreate = 102,
  RoleUpdate = 103,
  RoleDelete = 104,

  User = 150,
  UserList = 151,
  UserCreate = 152,
  UserUpdate = 153,
  UserDelete = 154,

  Language = 200,
  LanguageList = 201,
  LanguageCreate = 202,
  LanguageUpdate = 203,
  LanguageDelete = 204,

  Translate = 250,
  TranslateList = 251,
  TranslateCreate = 252,
  TranslateUpdate = 253,
  TranslateDelete = 254,

  MissingTranslate = 300,
  MissingTranslateList = 301,
  MissingTranslateCreate = 302,
  MissingTranslateUpdate = 303,
  MissingTranslateDelete = 304,

  Material = 350,
  MaterialList = 351,
  MaterialCreate = 352,
  MaterialDelete = 353,
  MaterialUpdate = 354,

  Category = 400,
  CategoryList = 401,
  CategoryCreate = 402,
  CategoryUpdate = 403,
  CategoryDelete = 404,

  Recipe = 450,
  RecipeList = 451,
  RecipeCreate = 452,
  RecipeUpdate = 453,
  RecipeDelete = 454,
  RecipeMaterialList = 455,
  RecipeMaterialDelete = 456,
  RecipeStepList = 457,
  RecipeStepDelete = 458,
  RecipeRateList = 459,
  RecipeRateDelete = 460,

  UserDocuments = 500,
  UserDocumentsList = 501,
  UserDocumentsCreate = 502,
  UserDocumentsDelete = 503,
  UserDocumentsUpdate = 504,

  Menu = 550,
  MenuList = 551,
  MenuCreate = 552,
  MenuUpdate = 553,
  MenuDelete = 554,
  MenuRecipeList = 555,
  MenuRecipeDelete = 556,

  UserPayments = 600,
  UserPaymentsList = 601,
  UserPaymentsCreate = 602,
  UserPaymentsUpdate = 603,
  UserPaymentsDelete = 604,

  Activity = 650,
  ActivityList = 651,
  ActivityCreate = 652,
  ActivityUpdate = 653,
  ActivityDelete = 654,

  Location = 700,
  LocationList = 701,
  LocationCreate = 702,
  LocationUpdate = 703,
  LocationDelete = 704,

  Product = 750,
  ProductList = 751,
  ProductCreate = 752,
  ProductUpdate = 753,
  ProductDelete = 754,

  Order = 800,
  OrderList = 801,
  OrderCreate = 802,
  OrderUpdate = 803,
  OrderDelete = 804,
  OrderProductList = 805,
  OrderProductDelete = 806,
}

export const RoleActionEnumLabel = new Map<number, Object>([
  [RoleActionEnum.Role, { topAction: null, label: 'action.role' }],
  [RoleActionEnum.RoleList, { topAction: RoleActionEnum.Role, label: 'action.role_list' }],
  [RoleActionEnum.RoleCreate, { topAction: RoleActionEnum.Role, label: 'action.role_create' }],
  [RoleActionEnum.RoleUpdate, { topAction: RoleActionEnum.Role, label: 'action.role_update' }],
  [RoleActionEnum.RoleDelete, { topAction: RoleActionEnum.Role, label: 'action.role_delete' }],
  [RoleActionEnum.User, { topAction: null, label: 'action.user' }],
  [RoleActionEnum.UserList, { topAction: RoleActionEnum.User, label: 'action.user_list' }],
  [RoleActionEnum.UserCreate, { topAction: RoleActionEnum.User, label: 'action.user_create' }],
  [RoleActionEnum.UserUpdate, { topAction: RoleActionEnum.User, label: 'action.user_update' }],
  [RoleActionEnum.UserDelete, { topAction: RoleActionEnum.User, label: 'action.user_delete' }],
  [RoleActionEnum.Language, { topAction: null, label: 'action.language' }],
  [RoleActionEnum.LanguageList, { topAction: RoleActionEnum.Language, label: 'action.language_list' }],
  [RoleActionEnum.LanguageCreate, { topAction: RoleActionEnum.Language, label: 'action.language_create' }],
  [RoleActionEnum.LanguageUpdate, { topAction: RoleActionEnum.Language, label: 'action.language_update' }],
  [RoleActionEnum.LanguageDelete, { topAction: RoleActionEnum.Language, label: 'action.language_delete' }],
  [RoleActionEnum.Translate, { topAction: null, label: 'action.translate' }],
  [RoleActionEnum.TranslateList, { topAction: RoleActionEnum.Translate, label: 'action.translate_list' }],
  [RoleActionEnum.TranslateCreate, { topAction: RoleActionEnum.Translate, label: 'action.translate_create' }],
  [RoleActionEnum.TranslateUpdate, { topAction: RoleActionEnum.Translate, label: 'action.translate_update' }],
  [RoleActionEnum.TranslateDelete, { topAction: RoleActionEnum.Translate, label: 'action.translate_delete' }],
  [RoleActionEnum.MissingTranslate, { topAction: null, label: 'action.missing_translate' }],
  [RoleActionEnum.MissingTranslateList, { topAction: RoleActionEnum.MissingTranslate, label: 'action.missing_translate_list' }],
  [RoleActionEnum.MissingTranslateCreate, { topAction: RoleActionEnum.MissingTranslate, label: 'action.missing_translate_create' }],
  [RoleActionEnum.MissingTranslateUpdate, { topAction: RoleActionEnum.MissingTranslate, label: 'action.missing_translate_update' }],
  [RoleActionEnum.MissingTranslateDelete, { topAction: RoleActionEnum.MissingTranslate, label: 'action.missing_translate_delete' }],
  [RoleActionEnum.Material, { topAction: null, label: 'action.material' }],
  [RoleActionEnum.MaterialList, { topAction: RoleActionEnum.Material, label: 'action.material_list' }],
  [RoleActionEnum.MaterialCreate, { topAction: RoleActionEnum.Material, label: 'action.material_create' }],
  [RoleActionEnum.MaterialUpdate, { topAction: RoleActionEnum.Material, label: 'action.material_update' }],
  [RoleActionEnum.MaterialDelete, { topAction: RoleActionEnum.Material, label: 'action.material_delete' }],
  [RoleActionEnum.Category, { topAction: null, label: 'action.category' }],
  [RoleActionEnum.CategoryList, { topAction: RoleActionEnum.Category, label: 'action.category_list' }],
  [RoleActionEnum.CategoryCreate, { topAction: RoleActionEnum.Category, label: 'action.category_create' }],
  [RoleActionEnum.CategoryUpdate, { topAction: RoleActionEnum.Category, label: 'action.category_update' }],
  [RoleActionEnum.CategoryDelete, { topAction: RoleActionEnum.Category, label: 'action.category_delete' }],
  [RoleActionEnum.Recipe, { topAction: null, label: 'action.recipe' }],
  [RoleActionEnum.RecipeList, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_list' }],
  [RoleActionEnum.RecipeCreate, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_create' }],
  [RoleActionEnum.RecipeUpdate, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_update' }],
  [RoleActionEnum.RecipeDelete, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_delete' }],
  [RoleActionEnum.RecipeRateList, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_rate_list' }],
  [RoleActionEnum.RecipeRateDelete, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_rate_delete' }],
  [RoleActionEnum.RecipeStepList, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_step_list' }],
  [RoleActionEnum.RecipeStepDelete, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_step_delete' }],
  [RoleActionEnum.RecipeMaterialList, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_material_list' }],
  [RoleActionEnum.RecipeMaterialDelete, { topAction: RoleActionEnum.Recipe, label: 'action.recipe_material_delete' }],
  [RoleActionEnum.UserDocuments, { topAction: null, label: 'action.user_documents' }],
  [RoleActionEnum.UserDocumentsList, { topAction: RoleActionEnum.UserDocuments, label: 'action.user_documents_list' }],
  [RoleActionEnum.UserDocumentsCreate, { topAction: RoleActionEnum.UserDocuments, label: 'action.user_documents_create' }],
  [RoleActionEnum.UserDocumentsUpdate, { topAction: RoleActionEnum.UserDocuments, label: 'action.user_documents_update' }],
  [RoleActionEnum.UserDocumentsDelete, { topAction: RoleActionEnum.UserDocuments, label: 'action.user_documents_delete' }],
  [RoleActionEnum.Menu, { topAction: null, label: 'action.menu' }],
  [RoleActionEnum.MenuList, { topAction: RoleActionEnum.Menu, label: 'action.menu_list' }],
  [RoleActionEnum.MenuCreate, { topAction: RoleActionEnum.Menu, label: 'action.menu_create' }],
  [RoleActionEnum.MenuUpdate, { topAction: RoleActionEnum.Menu, label: 'action.menu_update' }],
  [RoleActionEnum.MenuDelete, { topAction: RoleActionEnum.Menu, label: 'action.menu_delete' }],
  [RoleActionEnum.MenuRecipeList, { topAction: RoleActionEnum.Menu, label: 'action.menu_recipe_list' }],
  [RoleActionEnum.MenuRecipeDelete, { topAction: RoleActionEnum.Menu, label: 'action.menu_recipe_delete' }],
  [RoleActionEnum.UserPayments, { topAction: null, label: 'action.user_payment' }],
  [RoleActionEnum.UserPaymentsList, { topAction: RoleActionEnum.UserPayments, label: 'action.user_payments_list' }],
  [RoleActionEnum.UserPaymentsCreate, { topAction: RoleActionEnum.UserPayments, label: 'action.user_payments_list' }],
  [RoleActionEnum.UserPaymentsUpdate, { topAction: RoleActionEnum.UserPayments, label: 'action.user_payments_list' }],
  [RoleActionEnum.UserPaymentsDelete, { topAction: RoleActionEnum.UserPayments, label: 'action.user_payments_list' }],
  [RoleActionEnum.Activity, { topAction: null, label: 'action.activity' }],
  [RoleActionEnum.ActivityList, { topAction: RoleActionEnum.Activity, label: 'action.activity_list' }],
  [RoleActionEnum.ActivityCreate, { topAction: RoleActionEnum.Activity, label: 'action.activity_list' }],
  [RoleActionEnum.ActivityUpdate, { topAction: RoleActionEnum.Activity, label: 'action.activity_list' }],
  [RoleActionEnum.ActivityDelete, { topAction: RoleActionEnum.Activity, label: 'action.activity_list' }],
  [RoleActionEnum.Location, { topAction: null, label: 'action.location' }],
  [RoleActionEnum.LocationList, { topAction: RoleActionEnum.Location, label: 'action.location_list' }],
  [RoleActionEnum.LocationCreate, { topAction: RoleActionEnum.Location, label: 'action.location_list' }],
  [RoleActionEnum.LocationUpdate, { topAction: RoleActionEnum.Location, label: 'action.location_list' }],
  [RoleActionEnum.LocationDelete, { topAction: RoleActionEnum.Location, label: 'action.location_list' }],
  [RoleActionEnum.Product, { topAction: null, label: 'action.product' }],
  [RoleActionEnum.ProductList, { topAction: RoleActionEnum.Product, label: 'action.product_list' }],
  [RoleActionEnum.ProductCreate, { topAction: RoleActionEnum.Product, label: 'action.product_list' }],
  [RoleActionEnum.ProductUpdate, { topAction: RoleActionEnum.Product, label: 'action.product_list' }],
  [RoleActionEnum.ProductDelete, { topAction: RoleActionEnum.Product, label: 'action.product_list' }],
  [RoleActionEnum.Order, { topAction: null, label: 'action.order' }],
  [RoleActionEnum.OrderList, { topAction: RoleActionEnum.Order, label: 'action.order_list' }],
  [RoleActionEnum.OrderCreate, { topAction: RoleActionEnum.Order, label: 'action.order_create' }],
  [RoleActionEnum.OrderUpdate, { topAction: RoleActionEnum.Order, label: 'action.order_update' }],
  [RoleActionEnum.OrderDelete, { topAction: RoleActionEnum.Order, label: 'action.order_delete' }],
  [RoleActionEnum.OrderProductList, { topAction: RoleActionEnum.Order, label: 'action.order_recipe_list' }],
  [RoleActionEnum.OrderProductDelete, { topAction: RoleActionEnum.Order, label: 'action.order_recipe_delete' }],
]);

export enum BucketType {
  Category = 0,
  ProfilePhotos = 1,
  Certificates = 2,
  Recipe = 3,
  Product = 4,
  Activity = 5
};

export enum TemplateType {
  Welcome = 0,
  ForgotPassword = 1,
  NewAccount = 2,
  NewRecipe = 3,
  RecipeOffer = 4,
  RecipeerRecipeComplete = 5,
  Announements = 6,
};

export enum NoticeTypeEnum {
  AppMobile = 1,
  AppEmail = 2
}

export enum ServiceTypeFilter {
  Person1_2 = 1,
  Person3_4 = 2,
  Person5_6 = 3,
  Person7_8 = 4,
}

export const ServiceTypeFilterLabel = new Map<number, string>([
  [ServiceTypeFilter.Person1_2, 'enum.service_type_filter.person1_2'],
  [ServiceTypeFilter.Person3_4, 'enum.service_type_filter.person3_4'],
  [ServiceTypeFilter.Person5_6, 'enum.service_type_filter.person5_6'],
  [ServiceTypeFilter.Person7_8, 'enum.service_type_filter.person7_8'],
]);

export enum TimeTypeFilter {
  Between_0_15_minute = 1,
  Between_15_30_minute = 2,
  Between_30_45_minute = 3,
  Between_45_60_minute = 4,
  Between_60_120_minute = 5,
  Between_120_240_minute = 6,
  More_240_minute = 7
}

export const TimeTypeFilterLabel = new Map<number, string>([
  [TimeTypeFilter.Between_0_15_minute, 'enum.time_type_filter.between_0_15_minute'],
  [TimeTypeFilter.Between_15_30_minute, 'enum.time_type_filter.between_15_30_minute'],
  [TimeTypeFilter.Between_30_45_minute, 'enum.time_type_filter.between_30_45_minute'],
  [TimeTypeFilter.Between_45_60_minute, 'enum.time_type_filter.between_45_60_minute'],
  [TimeTypeFilter.Between_60_120_minute, 'enum.time_type_filter.between_60_120_minute'],
  [TimeTypeFilter.Between_120_240_minute, 'enum.time_type_filter.between_120_240_minute'],
  [TimeTypeFilter.More_240_minute, 'enum.time_type_filter.more_240_minute'],
]);

export enum RecipeOrderFilter {
  Title_A_Z = 1,
  Title_Z_A = 2,
  Service_A_Z = 3,
  Service_Z_A = 4,
  Preparation_A_Z = 5,
  Preparation_Z_A = 6,
  Cooking_A_Z = 7,
  Cooking_Z_A = 8,
  Rate_A_Z = 7,
  Rate_Z_A = 8,
}

export const RecipeOrderFilterLabel = new Map<number, string>([
  [RecipeOrderFilter.Title_A_Z, 'enum.recipe_order_filter.title_a_z'],
  [RecipeOrderFilter.Title_Z_A, 'enum.recipe_order_filter.title_Z_A'],
  [RecipeOrderFilter.Service_A_Z, 'enum.recipe_order_filter.service_A_Z'],
  [RecipeOrderFilter.Service_Z_A, 'enum.recipe_order_filter.service_Z_A'],
  [RecipeOrderFilter.Preparation_A_Z, 'enum.recipe_order_filter.preparation_A_Z'],
  [RecipeOrderFilter.Preparation_Z_A, 'enum.recipe_order_filter.preparation_Z_A'],
  [RecipeOrderFilter.Cooking_A_Z, 'enum.recipe_order_filter.cooking_A_Z'],
  [RecipeOrderFilter.Cooking_Z_A, 'enum.recipe_order_filter.cooking_Z_A'],
  [RecipeOrderFilter.Rate_A_Z, 'enum.recipe_order_filter.rate_A_Z'],
  [RecipeOrderFilter.Rate_Z_A, 'enum.recipe_order_filter.rate_Z_A'],
]);