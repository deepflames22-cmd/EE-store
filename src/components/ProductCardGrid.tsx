import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice, type Product } from "../data/products";
import { useCart } from "../store/CartContext";
import { PlusIcon } from "./Icons";
import { useInView } from "../hooks/useInView";

function Card({ product, index }: { product: Product; index: number }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative plate-dark border-2 border-ink overflow-hidden">
        <button
          data-cursor
          onClick={() => navigate(`/product/${product.id}`)}
          className="block w-full px-8 pt-10 pb-4"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            draggable={false}
            className="blend-lighten mx-auto h-52 object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 group-hover:-rotate-2"
          />
        </button>
        {product.was && (
          <span className="absolute top-4 left-4 bg-rust text-paper font-mono text-[9px] font-medium tracking-[0.18em] px-2 py-1">
            −{Math.round((1 - product.price / product.was) * 100)}%
          </span>
        )}
        {!product.was && product.tag && (
          <span className="absolute top-4 left-4 bg-brass text-ink font-mono text-[9px] font-medium tracking-[0.18em] px-2 py-1">
            {product.tag}
          </span>
        )}
        <button
          data-cursor
          onClick={() => navigate(`/brand/${encodeURIComponent(product.brand)}`)}
          className="absolute top-4 right-4 font-mono text-[9px] tracking-[0.2em] uppercase text-goldlight bg-ink/70 border border-brass/30 px-2 py-1 hover:bg-brass hover:text-ink hover:border-brass transition-all duration-300"
        >
          {product.brand}
        </button>
      </div>
      <div className="border-2 border-t-0 border-ink bg-paper px-5 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <button
            data-cursor
            onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}
            className="font-mono text-[9px] tracking-[0.24em] uppercase text-gold hover:text-goldlight transition-colors"
          >
            {product.category}
          </button>
          <button
            data-cursor
            onClick={() => navigate(`/product/${product.id}`)}
            className="font-display font-bold text-lg hover:text-gold transition-colors truncate block"
          >
            {product.name}
          </button>
          <div className="text-sm tabular-nums">
            <span className="text-mist">{formatPrice(product.price)}</span>
            {product.was && <span className="ml-2 text-mist/50 line-through">{formatPrice(product.was)}</span>}
          </div>
        </div>
        <button
          data-cursor
          onClick={() => add(product)}
          aria-label={`Add ${product.name} to cart`}
          className="shrink-0 w-11 h-11 border-2 border-ink text-ink flex items-center justify-center hover:bg-brass hover:border-brass hover:rotate-90 transition-all duration-300"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function ProductCardGrid({ items, cols = 3 }: { items: Product[]; cols?: 2 | 3 | 4 }) {
  const gridCls =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 4
      ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`mt-10 grid grid-cols-1 ${gridCls} gap-7`}>
      {items.map((p, i) => (
        <Card key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
