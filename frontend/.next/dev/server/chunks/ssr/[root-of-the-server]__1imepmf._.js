module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/data/products.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "categoriesData",
    ()=>categoriesData,
    "products",
    ()=>products,
    "productsData",
    ()=>productsData
]);
const categoriesData = [
    {
        id: 1,
        label: 'مُستحسَن',
        active: true
    },
    {
        id: 2,
        label: 'Temu Season Clearance',
        icon: '🏷️'
    },
    {
        id: 3,
        label: 'Top 100 Bestsellers',
        icon: '🔥'
    },
    {
        id: 4,
        label: 'Flash Sale',
        icon: '⚡'
    },
    {
        id: 5,
        label: 'Best Value'
    },
    {
        id: 6,
        label: 'Home Garden'
    },
    {
        id: 7,
        label: 'Hobbies Leisure'
    },
    {
        id: 8,
        label: 'Apparel'
    },
    {
        id: 9,
        label: 'Sports Fitness'
    }
];
const categories = categoriesData;
const productsData = [
    {
        id: '1',
        title: 'سماعات لاسلكية عزل صوت ممتاز',
        price: '$12.99',
        originalPrice: '$29.99',
        discount: '56%',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80'
        ],
        rating: 4.8,
        reviewsCount: 120,
        soldCount: '1.2k',
        badge: 'الأكثر مبيعاً'
    },
    {
        id: '2',
        title: 'ساعة ذكية مقاومة للماء مع شاشة Touch',
        price: '$19.50',
        originalPrice: '$45.00',
        discount: '57%',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
        ],
        rating: 4.6,
        reviewsCount: 85,
        soldCount: '850',
        badge: 'خصم خاطف'
    },
    {
        id: '3',
        title: 'حقيبة ظهر حديثة مقاومة للمطر',
        price: '$24.99',
        originalPrice: '$50.00',
        discount: '50%',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'
        ],
        rating: 4.9,
        reviewsCount: 210,
        soldCount: '3.4k'
    },
    {
        id: '4',
        title: 'نظارات شمسية كلاسيكية قطبية',
        price: '$8.99',
        originalPrice: '$18.00',
        discount: '50%',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
        images: [
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80'
        ],
        rating: 4.5,
        reviewsCount: 45,
        soldCount: '400'
    }
];
const products = productsData;
}),
"[project]/src/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.2vob68tjqpejf.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[project]/src/app/product/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/data/products.ts [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './ProductMainSection'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
async function ProductPage({ params }) {
    const { id } = await params;
    // جلب المنتج المطلوب مباشرة من ملف البيانات المشارك
    const product = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["productsData"].find((p)=>String(p.id) === String(id));
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                textAlign: 'center',
                padding: '50px',
                color: '#fff'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "المنتج غير موجود"
            }, void 0, false, {
                fileName: "[project]/src/app/product/[id]/page.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/product/[id]/page.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductMainSection, {
            title: product.title,
            currentPrice: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            rating: product.rating,
            reviewsCount: product.reviewsCount,
            soldCount: product.soldCount,
            images: product.images || [
                product.image
            ]
        }, void 0, false, {
            fileName: "[project]/src/app/product/[id]/page.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/product/[id]/page.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/product/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/product/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1imepmf._.js.map