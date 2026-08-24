export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const AVAILABLE_COUPONS: Record<string, { discountPercent: number; minOrder: number; label: string }> = {
  'NEXUS10': { discountPercent: 10, minOrder: 1000, label: '10% OFF on orders above ₹1,000' },
  'SUPER20': { discountPercent: 20, minOrder: 5000, label: '20% OFF on orders above ₹5,000' },
  'WELCOME500': { discountPercent: 15, minOrder: 2000, label: 'Flat 15% Welcome Discount' },
};
