import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

/* ─────────────────────────────────────────────
   Mobile-first Product Customiser Bottom Sheet
   Positioning is done entirely via inline styles
   to guarantee no horizontal overflow on any device.
───────────────────────────────────────────── */
function ProductCustomizer({ product, onClose }) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Regular');
  const [milk, setMilk] = useState('Whole');
  const [sweetness, setSweetness] = useState('None');
  const [extraShot, setExtraShot] = useState(false);
  const [coldFoam, setColdFoam] = useState(false);
  const [caramelDrizzle, setCaramelDrizzle] = useState(false);
  const [notes, setNotes] = useState('');

  /* ── Price calculation ── */
  const unitPrice = (() => {
    let p = product.price;
    if (size === 'Large') p += 1.5;
    if (milk !== 'Whole') p += 1.5;
    if (extraShot) p += 2.0;
    if (coldFoam) p += 1.5;
    if (caramelDrizzle) p += 1.0;
    return p;
  })();

  const totalPrice = (unitPrice * quantity).toFixed(3);

  /* ── Add to cart ── */
  const handleAdd = () => {
    const extras = [
      milk !== 'Whole' && milk,
      sweetness !== 'None' && sweetness + ' Sweet',
      extraShot && 'Extra Shot',
      coldFoam && 'Cold Foam',
      caramelDrizzle && 'Caramel',
    ].filter(Boolean);

    addToCart({
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice,
      size: size === 'Regular' ? 'Regular (350ml)' : 'Large (480ml)',
      customizations: extras.join(', '),
      specialNotes: notes,
      imageUrl: product.imageUrl,
    });
    onClose();
  };

  /* ── Options ── */
  const sizeOpts = [
    { label: 'Regular', sub: '350 ml', extra: '+0.000' },
    { label: 'Large', sub: '480 ml', extra: '+1.500' },
  ];
  const milkOpts = [
    { label: 'Entier', value: 'Whole' },
    { label: 'Avoine', value: 'Oat' },
    { label: 'Amande', value: 'Almond' },
    { label: 'Coco', value: 'Coconut' },
  ];
  const sweetOpts = [
    { label: 'Sans', value: 'None' },
    { label: 'Normal', value: 'Standard' },
    { label: 'Très Sucré', value: 'Extra Sweet' },
  ];
  const extraOpts = [
    { label: 'Espresso Supplémentaire', price: '2.000', state: extraShot, set: setExtraShot },
    { label: 'Mousse Vanille Froide', price: '1.500', state: coldFoam, set: setColdFoam },
    { label: 'Filet de Caramel', price: '1.000', state: caramelDrizzle, set: setCaramelDrizzle },
  ];

  /* ────────────────────────────── JSX ────────────────────────────── */
  return (
    /* Overlay */
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(12px)',
        }}
      />

      {/* ── Sheet ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 350,
          maxHeight: '94dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
          background: 'var(--color-surface-container-low, #1c1c1e)',
          animation: 'modalPop 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Pull handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '0 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 10, color: 'var(--color-primary,#a78bfa)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
              {product.category?.name || 'Spécialité'}
            </p>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.description}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.08)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}
          className="slim-scrollbar">

          {/* Product image */}
          {product.imageUrl && (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 140 }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', bottom: 8, left: 8,
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                padding: '3px 10px', borderRadius: 20,
                fontSize: 12, fontWeight: 700, color: '#a78bfa',
              }}>
                Base: {product.price.toFixed(3)} TND
              </div>
            </div>
          )}

          {/* ── Size ── */}
          <Section label="Taille">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {sizeOpts.map(s => (
                <button
                  key={s.label}
                  onClick={() => setSize(s.label)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: size === s.label ? 'var(--color-primary-container,#6d28d9)' : 'rgba(255,255,255,0.07)',
                    color: size === s.label ? '#fff' : 'rgba(255,255,255,0.7)',
                    transition: 'background 0.2s',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}<br /><span style={{ fontSize: 11, opacity: .7 }}>{s.sub}</span></span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', opacity: .8 }}>{s.extra}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* ── Milk ── */}
          <Section label="Choix du Lait">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {milkOpts.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMilk(m.value)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: milk === m.value ? 'var(--color-primary-container,#6d28d9)' : 'rgba(255,255,255,0.07)',
                    color: milk === m.value ? '#fff' : 'rgba(255,255,255,0.7)',
                    transition: 'background 0.2s',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', opacity: .8 }}>{m.value !== 'Whole' ? '+1.500' : '+0.000'}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* ── Sweetness ── */}
          <Section label="Niveau de Sucre">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {sweetOpts.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSweetness(s.value)}
                  style={{
                    padding: '9px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: sweetness === s.value ? 'var(--color-primary,#7c3aed)' : 'rgba(255,255,255,0.07)',
                    color: sweetness === s.value ? '#fff' : 'rgba(255,255,255,0.7)',
                    fontSize: 12, fontWeight: 600, lineHeight: 1.3,
                    transition: 'background 0.2s',
                    overflow: 'hidden', wordBreak: 'break-word',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* ── Extras ── */}
          <Section label="Extras">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {extraOpts.map((e, i) => (
                <label
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 14px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.07)', gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={e.state}
                      onChange={ev => e.set(ev.target.checked)}
                      style={{ width: 17, height: 17, accentColor: 'var(--color-primary,#7c3aed)', flexShrink: 0, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-secondary,#a78bfa)', flexShrink: 0 }}>
                    +{e.price}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          {/* ── Notes ── */}
          <Section label="Notes au Barista">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Très chaud, décaféiné, peu de glace..."
              rows={2}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '10px 14px',
                color: '#fff', fontSize: 13,
                resize: 'none', outline: 'none',
              }}
            />
          </Section>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}>
          {/* Quantity */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.07)',
            borderRadius: 40, padding: '6px 12px', flexShrink: 0,
          }}>
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
            </button>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', minWidth: 16, textAlign: 'center' }}>{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            </button>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            style={{
              flex: 1, height: 46, borderRadius: 40, border: 'none', cursor: 'pointer',
              background: 'var(--color-primary-container,#6d28d9)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 0 20px rgba(109,40,217,0.5)',
              transition: 'opacity .2s, transform .1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_shopping_cart</span>
            <span>Ajouter</span>
            <span style={{ opacity: .5, fontSize: 12 }}>•</span>
            <span style={{ fontFamily: 'monospace' }}>{totalPrice} TND</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Small helper ── */
function Section({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: .8 }}>
        {label}
      </span>
      {children}
    </div>
  );
}

export default ProductCustomizer;
