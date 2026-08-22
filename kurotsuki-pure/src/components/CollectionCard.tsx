import { Link } from 'react-router-dom';
import ArtIcon from '../art/ArtIcon';
import type { Collection } from '../pages/CollectionsPage';
import { getCollectionProductCount } from '../data/dummyData';
import { StaggerItem } from './Reveal';
import { motion } from 'framer-motion';

export default function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
    >
      <StaggerItem className="card">
        <Link to={`/collections/${collection.id}`}>
          <div className="card-visual">
            <img className='collectionImg' src={collection.imgSrc} alt={collection.name} />
          </div>

          <div className="card-info">
            <div>
              <div className="card-name">{collection.name}</div>
              {collection.description && (
                <div className="card-ref jp">{collection.description}</div>
              )}
            </div>

            <div className="card-price mono">3 pcs</div>
          </div>
        </Link>
      </StaggerItem>
    </motion.div>
  );
}
