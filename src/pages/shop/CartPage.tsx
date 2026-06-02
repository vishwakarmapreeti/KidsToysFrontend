import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

/* ─── Types ───────────────────────────────────────────────── */
interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    stock: number;
    category: { name: string };
  };
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

/* ─── Tiny reusable spinner ───────────────────────────────── */
const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
    <div className="cart-spinner" />
  </div>
);

/* ═══════════════════════════════════════════════════════════ */
/*                       CART PAGE                            */
/* ═══════════════════════════════════════════════════════════ */
export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // itemId being updated
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /* fetch cart */
  const fetchCart = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/v1/user/cart');
      setCart(data.cart ?? data);
    } catch {
      setError('Could not load your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  /* update qty */
  const handleQtyChange = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(itemId);
    try {
      const { data } = await axiosInstance.put(`/api/v1/user/cart/${itemId}`, { quantity });
      setCart(data.cart ?? data);
    } catch {
      setError('Could not update quantity.');
    } finally {
      setUpdating(null);
    }
  };

  /* remove item */
  const handleRemove = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const { data } = await axiosInstance.delete(`/api/v1/user/cart/${itemId}`);
      setCart(data.cart ?? data);
    } catch {
      setError('Could not remove item.');
    } finally {
      setUpdating(null);
    }
  };

  /* clear cart */
  const handleClear = async () => {
    if (!confirm('Clear your entire cart?')) return;
    setLoading(true);
    try {
      await axiosInstance.delete('/api/v1/user/cart/clear');
      setCart({ items: [], totalPrice: 0 });
    } catch {
      setError('Could not clear cart.');
    } finally {
      setLoading(false);
    }
  };

  /* ── render ── */
  if (loading) return <><CartStyles /><Spinner /></>;

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <>
      <CartStyles />
      <div className="cp-wrap">
        {/* ── Header ── */}
        <div className="cp-header">
          <button className="cp-back" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="cp-title">
            <span className="cp-icon">🛒</span> My Cart
            {!isEmpty && <span className="cp-badge">{cart!.items.length}</span>}
          </h1>
          {!isEmpty && (
            <button className="cp-clear-btn" onClick={handleClear}>Clear All</button>
          )}
        </div>

        {error && <div className="cp-error">{error}</div>}

        {isEmpty ? (
          /* ── Empty state ── */
          <div className="cp-empty">
            <div className="cp-empty-emoji">🧸</div>
            <h2>Your cart is empty!</h2>
            <p>Looks like you haven't added any toys yet.</p>
            <Link to="/shop" className="cp-shop-btn">Explore Shop</Link>
          </div>
        ) : (
          /* ── Cart content ── */
          <div className="cp-body">
            <div className="cp-items">
              {cart!.items.map((item) => {
                const busy = updating === item._id;
                const img = item.product?.images?.[0] ?? '/placeholder.png';
                return (
                  <div key={item._id} className={`cp-card ${busy ? 'cp-card--busy' : ''}`}>
                    {/* product image */}
                    <div className="cp-img-wrap">
                      <img
                        src={img}
                        alt={item.product.name}
                        className="cp-img"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                    </div>

                    {/* details */}
                    <div className="cp-details">
                      <span className="cp-cat">{item.product.category?.name}</span>
                      <Link to={`/product/${item.product._id}`} className="cp-name">
                        {item.product.name}
                      </Link>
                      <span className="cp-unit-price">₹{item.price.toLocaleString('en-IN')} each</span>
                    </div>

                    {/* qty + subtotal */}
                    <div className="cp-right">
                      <div className="cp-qty-row">
                        <button
                          className="cp-qty-btn"
                          disabled={busy || item.quantity <= 1}
                          onClick={() => handleQtyChange(item._id, item.quantity - 1)}
                        >−</button>
                        <span className="cp-qty-num">{item.quantity}</span>
                        <button
                          className="cp-qty-btn"
                          disabled={busy || item.quantity >= item.product.stock}
                          onClick={() => handleQtyChange(item._id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <span className="cp-subtotal">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        className="cp-remove"
                        disabled={busy}
                        onClick={() => handleRemove(item._id)}
                      >
                        {busy ? '...' : '🗑'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Order Summary ── */}
            <aside className="cp-summary">
              <h2 className="cp-summary-title">Order Summary</h2>

              <div className="cp-summary-rows">
                {cart!.items.map((item) => (
                  <div key={item._id} className="cp-summary-row">
                    <span className="cp-summary-item-name">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="cp-divider" />

              <div className="cp-summary-total-row">
                <span>Subtotal</span>
                <span>₹{cart!.totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="cp-summary-total-row cp-shipping">
                <span>Shipping</span>
                <span className="cp-free">FREE</span>
              </div>

              <div className="cp-divider" />

              <div className="cp-grand-total">
                <span>Total</span>
                <span>₹{cart!.totalPrice.toLocaleString('en-IN')}</span>
              </div>

              <button
                className="cp-checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>

              <Link to="/shop" className="cp-continue">← Continue Shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                       STYLES                               */
/* ═══════════════════════════════════════════════════════════ */
function CartStyles() {
  return (
    <style>{`
      /* ── Google Font ── */
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,wght@0,700;1,400&display=swap');

      /* ── Tokens ── */
      :root {
        --cart-bg:       #fdf8f3;
        --cart-surface:  #ffffff;
        --cart-border:   #f0e8de;
        --cart-accent:   #ff6b35;
        --cart-accent2:  #ffb347;
        --cart-text:     #2d2016;
        --cart-muted:    #9e8a77;
        --cart-green:    #22a369;
        --cart-radius:   18px;
        --cart-shadow:   0 4px 24px rgba(45,32,22,.08);
        --cart-font:     'Nunito', sans-serif;
        --cart-display:  'Fraunces', serif;
      }

      /* ── Layout ── */
      .cp-wrap {
        min-height: 100vh;
        background: var(--cart-bg);
        font-family: var(--cart-font);
        color: var(--cart-text);
        padding: 32px 24px 80px;
        max-width: 1200px;
        margin: 0 auto;
      }

      /* ── Header ── */
      .cp-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 36px;
        flex-wrap: wrap;
      }
      .cp-title {
        font-family: var(--cart-display);
        font-size: 2.4rem;
        font-weight: 700;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
      }
      .cp-icon { font-size: 2rem; }
      .cp-badge {
        background: var(--cart-accent);
        color: #fff;
        font-family: var(--cart-font);
        font-size: 1rem;
        font-weight: 800;
        border-radius: 50px;
        padding: 2px 12px;
        vertical-align: middle;
      }
      .cp-back {
        background: none;
        border: 2px solid var(--cart-border);
        border-radius: 50px;
        padding: 8px 20px;
        font-family: var(--cart-font);
        font-weight: 700;
        cursor: pointer;
        color: var(--cart-text);
        transition: border-color .2s, background .2s;
        white-space: nowrap;
      }
      .cp-back:hover { border-color: var(--cart-accent); background: #fff5f0; }
      .cp-clear-btn {
        background: none;
        border: 2px solid #fbd0c5;
        color: var(--cart-accent);
        border-radius: 50px;
        padding: 8px 20px;
        font-family: var(--cart-font);
        font-weight: 700;
        cursor: pointer;
        transition: background .2s;
        white-space: nowrap;
      }
      .cp-clear-btn:hover { background: #fff0eb; }

      /* ── Error ── */
      .cp-error {
        background: #fde8e8;
        border: 1px solid #f8c0c0;
        color: #c0392b;
        border-radius: 12px;
        padding: 14px 20px;
        margin-bottom: 20px;
        font-weight: 600;
      }

      /* ── Empty ── */
      .cp-empty {
        text-align: center;
        padding: 100px 20px;
        background: var(--cart-surface);
        border-radius: var(--cart-radius);
        box-shadow: var(--cart-shadow);
      }
      .cp-empty-emoji { font-size: 5rem; margin-bottom: 16px; }
      .cp-empty h2 { font-family: var(--cart-display); font-size: 2rem; margin: 0 0 8px; }
      .cp-empty p { color: var(--cart-muted); margin: 0 0 28px; }
      .cp-shop-btn {
        display: inline-block;
        background: var(--cart-accent);
        color: #fff;
        font-family: var(--cart-font);
        font-weight: 800;
        border-radius: 50px;
        padding: 14px 36px;
        text-decoration: none;
        font-size: 1.05rem;
        transition: transform .15s, box-shadow .15s;
        box-shadow: 0 4px 16px rgba(255,107,53,.35);
      }
      .cp-shop-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,53,.4); }

      /* ── Body ── */
      .cp-body {
        display: grid;
        grid-template-columns: 1fr 360px;
        gap: 28px;
        align-items: start;
      }
      @media (max-width: 900px) {
        .cp-body { grid-template-columns: 1fr; }
      }

      /* ── Item card ── */
      .cp-items { display: flex; flex-direction: column; gap: 16px; }
      .cp-card {
        background: var(--cart-surface);
        border-radius: var(--cart-radius);
        box-shadow: var(--cart-shadow);
        border: 1.5px solid var(--cart-border);
        display: grid;
        grid-template-columns: 120px 1fr auto;
        gap: 20px;
        padding: 20px;
        transition: opacity .2s;
        align-items: center;
      }
      .cp-card--busy { opacity: 0.5; pointer-events: none; }
      @media (max-width: 600px) {
        .cp-card { grid-template-columns: 90px 1fr; grid-template-rows: auto auto; }
        .cp-right { grid-column: 1 / -1; justify-content: flex-start; }
      }

      .cp-img-wrap {
        width: 120px; height: 120px;
        border-radius: 14px;
        overflow: hidden;
        background: #f9f3ed;
        flex-shrink: 0;
      }
      .cp-img { width: 100%; height: 100%; object-fit: cover; }

      .cp-details { display: flex; flex-direction: column; gap: 4px; justify-content: center; }
      .cp-cat {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: var(--cart-accent);
        background: #fff5f0;
        border-radius: 50px;
        padding: 2px 10px;
        width: fit-content;
      }
      .cp-name {
        font-weight: 800;
        font-size: 1.05rem;
        color: var(--cart-text);
        text-decoration: none;
        line-height: 1.3;
      }
      .cp-name:hover { color: var(--cart-accent); }
      .cp-unit-price { font-size: 0.88rem; color: var(--cart-muted); font-weight: 600; }

      .cp-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
      }
      .cp-qty-row {
        display: flex;
        align-items: center;
        gap: 0;
        background: var(--cart-bg);
        border: 1.5px solid var(--cart-border);
        border-radius: 50px;
        overflow: hidden;
      }
      .cp-qty-btn {
        background: none;
        border: none;
        width: 36px; height: 36px;
        font-size: 1.2rem;
        font-weight: 800;
        cursor: pointer;
        color: var(--cart-text);
        transition: background .15s;
        display: flex; align-items: center; justify-content: center;
      }
      .cp-qty-btn:hover:not(:disabled) { background: #ffe8de; color: var(--cart-accent); }
      .cp-qty-btn:disabled { opacity: .35; cursor: not-allowed; }
      .cp-qty-num {
        min-width: 32px;
        text-align: center;
        font-weight: 800;
        font-size: 0.95rem;
      }

      .cp-subtotal { font-weight: 900; font-size: 1.15rem; color: var(--cart-text); }
      .cp-remove {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity .2s;
        padding: 4px;
      }
      .cp-remove:hover { opacity: 1; }

      /* ── Summary panel ── */
      .cp-summary {
        background: var(--cart-surface);
        border-radius: var(--cart-radius);
        box-shadow: var(--cart-shadow);
        border: 1.5px solid var(--cart-border);
        padding: 28px 24px;
        position: sticky;
        top: 24px;
      }
      .cp-summary-title {
        font-family: var(--cart-display);
        font-size: 1.5rem;
        margin: 0 0 20px;
      }
      .cp-summary-rows { display: flex; flex-direction: column; gap: 8px; }
      .cp-summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.88rem;
        color: var(--cart-muted);
      }
      .cp-summary-item-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 170px;
      }
      .cp-divider {
        height: 1px;
        background: var(--cart-border);
        margin: 16px 0;
      }
      .cp-summary-total-row {
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        font-size: 0.95rem;
        margin-bottom: 6px;
      }
      .cp-shipping { font-size: 0.9rem; }
      .cp-free { color: var(--cart-green); font-weight: 800; }
      .cp-grand-total {
        display: flex;
        justify-content: space-between;
        font-family: var(--cart-display);
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 24px;
      }

      .cp-checkout-btn {
        width: 100%;
        background: linear-gradient(135deg, var(--cart-accent), var(--cart-accent2));
        color: #fff;
        border: none;
        border-radius: 14px;
        padding: 16px;
        font-family: var(--cart-font);
        font-weight: 900;
        font-size: 1.05rem;
        cursor: pointer;
        transition: transform .15s, box-shadow .15s;
        box-shadow: 0 4px 16px rgba(255,107,53,.35);
        margin-bottom: 14px;
      }
      .cp-checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,53,.45); }

      .cp-continue {
        display: block;
        text-align: center;
        color: var(--cart-muted);
        font-size: 0.88rem;
        font-weight: 700;
        text-decoration: none;
        transition: color .2s;
      }
      .cp-continue:hover { color: var(--cart-accent); }

      /* ── Spinner ── */
      .cart-spinner {
        width: 44px; height: 44px;
        border: 4px solid #f0e8de;
        border-top-color: var(--cart-accent);
        border-radius: 50%;
        animation: cpSpin .7s linear infinite;
      }
      @keyframes cpSpin { to { transform: rotate(360deg); } }
    `}</style>
  );
}