import { useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { usePCBuilderStore } from '../store/usePCBuilderStore';
import { useAuthStore } from '../store/useAuthStore';

export interface PageContextSummary {
  pathname: string;
  pageType: 'home' | 'builder' | 'cart' | 'product-details' | 'products' | 'category' | 'orders' | 'other';
  productId?: string;
  cartSummary: {
    itemCount: number;
    subtotal: number;
    grandTotal: number;
    couponCode: string;
    itemsBrief: { name: string; price: number; qty: number }[];
    bundlesCount: number;
  };
  builderSummary: {
    filledSlotsCount: number;
    totalPrice: number;
    estimatedWattage: number;
    isCompatible: boolean;
    issuesCount: number;
    componentsBrief: { slot: string; name: string; price: number }[];
  };
  authStatus: {
    isAuthenticated: boolean;
    userName: string;
  };
  contextualSuggestions: string[];
}

export function useAssistantContext(): PageContextSummary {
  const location = useLocation();
  const pathname = location.pathname;

  // Stores
  const { items, bundles, getItemsCount, getSubtotal, getGrandTotal, couponCode } = useCartStore();
  const { build, getTotalPrice, getEstimatedWattage, getFilledSlotsCount, getCompatibilityReport } = usePCBuilderStore();
  const { isAuthenticated, user } = useAuthStore();

  // Determine page type
  let pageType: PageContextSummary['pageType'] = 'other';
  let productId: string | undefined = undefined;

  if (pathname === '/' || pathname === '') {
    pageType = 'home';
  } else if (pathname.startsWith('/builder') || pathname.startsWith('/pc-builder')) {
    pageType = 'builder';
  } else if (pathname.startsWith('/cart') || pathname.startsWith('/checkout')) {
    pageType = 'cart';
  } else if (pathname.startsWith('/product/')) {
    pageType = 'product-details';
    productId = pathname.split('/product/')[1]?.split('/')[0];
  } else if (pathname.startsWith('/products')) {
    pageType = 'products';
  } else if (pathname.startsWith('/orders') || pathname.startsWith('/order')) {
    pageType = 'orders';
  } else if (
    pathname.startsWith('/processors-gpus') ||
    pathname.startsWith('/thermal-systems') ||
    pathname.startsWith('/memory') ||
    pathname.startsWith('/gaming-consoles') ||
    pathname.startsWith('/cables-headers') ||
    pathname.startsWith('/displays') ||
    pathname.startsWith('/servers')
  ) {
    pageType = 'category';
  }

  // Cart summary
  const itemsBrief = items.slice(0, 5).map((i) => ({
    name: i.product.name,
    price: i.product.price,
    qty: i.quantity,
  }));

  // Builder summary
  const filledComponents: { slot: string; name: string; price: number }[] = [];
  (Object.keys(build) as (keyof typeof build)[]).forEach((slot) => {
    const part = build[slot];
    if (part) {
      filledComponents.push({
        slot,
        name: part.name,
        price: part.price,
      });
    }
  });

  const compat = getCompatibilityReport();

  // Contextual suggestions based on route
  let contextualSuggestions: string[] = [];
  switch (pageType) {
    case 'product-details':
      contextualSuggestions = [
        'Is this component good for 1440p gaming?',
        'What CPU / Motherboard should I pair with this?',
        'Find a cost-effective alternative',
        'Will this fit my current build?',
      ];
      break;

    case 'builder':
      contextualSuggestions = [
        'Check my build compatibility and wattage',
        'Optimize my build for value and performance',
        'Suggest the best GPU for this configuration',
        'Is my power supply sufficient for future upgrades?',
      ];
      break;

    case 'cart':
      contextualSuggestions = [
        'Check my cart for component balance',
        'Are there any missing parts for a complete PC?',
        'Can I reduce the price without losing performance?',
        'What active promo codes are available?',
      ];
      break;

    case 'products':
    case 'category':
      contextualSuggestions = [
        'Compare these hardware options',
        'Find the highest rated components in this category',
        'Recommend the best pick under ₹30,000',
        'Explain the key differences in specifications',
      ];
      break;

    case 'orders':
      contextualSuggestions = [
        'Where can I track my active order?',
        'What is the warranty policy on PC parts?',
        'Can I get upgrade advice for my purchased build?',
      ];
      break;

    case 'home':
    default:
      contextualSuggestions = [
        'Build me a gaming PC under ₹80,000',
        'Find the best GPU for 1440p high-refresh gaming',
        'Check compatibility for AMD AM5 vs Intel LGA1700',
        'Help me choose a budget processor and motherboard',
      ];
      break;
  }

  return {
    pathname,
    pageType,
    productId,
    cartSummary: {
      itemCount: getItemsCount(),
      subtotal: getSubtotal(),
      grandTotal: getGrandTotal(),
      couponCode,
      itemsBrief,
      bundlesCount: bundles.length,
    },
    builderSummary: {
      filledSlotsCount: getFilledSlotsCount(),
      totalPrice: getTotalPrice(),
      estimatedWattage: getEstimatedWattage(),
      isCompatible: compat.isCompatible,
      issuesCount: compat.issues.length,
      componentsBrief: filledComponents,
    },
    authStatus: {
      isAuthenticated,
      userName: user?.name || 'Guest User',
    },
    contextualSuggestions,
  };
}
