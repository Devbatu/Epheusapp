import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/format'

export default function CartPage() {
  const { items, setQty, remove, total, clear } = useCartStore()

  const subtotal = total()
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 7.9
  const grandTotal = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream text-gold-dark ">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-primary ">Your cart is empty</h1>
        <p className="mt-2 text-text-light">Discover our handcrafted Turkish delights.</p>
        <Link to="/shop" className="mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-primary ">My Cart ({items.length})</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-mist bg-surface p-4  "
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream ">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-mist"><Package className="h-8 w-8" /></div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <Link to={`/shop/${item.slug}`} className="text-sm font-semibold text-primary hover:text-gold-dark ">
                    {item.name}
                  </Link>
                  <button onClick={() => remove(item.id)} className="text-text-light hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-mist ">
                    <button onClick={() => setQty(item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-text-light hover:text-gold-dark">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-primary ">{item.quantity}</span>
                    <button onClick={() => setQty(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-text-light hover:text-gold-dark">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="font-bold text-primary ">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clear} className="text-sm text-text-light hover:text-red-500">Clear cart</button>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-mist bg-surface p-6  ">
          <h2 className="mb-4 font-semibold text-primary ">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-charcoal/70 ">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal/70 ">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatCurrency(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gold-dark">Free shipping on orders over $75!</p>
            )}
            <div className="border-t border-mist pt-3 ">
              <div className="flex justify-between text-base font-bold text-primary ">
                <span>Total</span><span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => toast.success('Demo: Order placed! (payment integration is illustrative)')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-semibold text-white hover:bg-primary-dark"
          >
            Checkout <ArrowRight className="h-4 w-4" />
          </button>
          <Link to="/shop" className="mt-3 block text-center text-sm text-text-light hover:text-gold-dark">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
