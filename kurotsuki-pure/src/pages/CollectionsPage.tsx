import { useEffect, useState } from 'react';
import CollectionCard from '../components/CollectionCard';
import Reveal, { StaggerGrid } from '../components/Reveal';
import { COLLECTIONS } from '../data/dummyData';
import { Link } from 'react-router-dom';



export type Collection = {
        id: string;
        name: string;
        description: string;
        price: number;
        
        imgSrc: string;
    };

export default function CollectionsPage() { 
   

   const [myCollection, setMyCollection] = useState<Collection[]>([]);
   
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
      const fetchCollection= async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/collection/GetAll"
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
  
          const data = await response.json();
          console.log(data.collections);
          setMyCollection(data.collections);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
  
      fetchCollection();
    }, []);

    useEffect(() => {
            const storedUser = sessionStorage.getItem("user");

            if (!storedUser) {
              return;
            }

            try {
              const user = JSON.parse(storedUser);

              setIsAdmin(user.role === "admin");
            } catch (error) {
              console.error("Error reading user from session:", error);
            }
            console.log(storedUser);
      }, []);
  return (
    <div className="page-wrap">
      <div className="page-hero">
        <Reveal>
          <div className="eyebrow">Curated Arcs</div>
          <h1 className="display">Collections</h1>
          <p>Grouped by story, not just season. Each collection is a chapter the owner hand-picked.</p>
        </Reveal>
        {isAdmin && (
                    <div>
                    <div style={{ marginTop: 24 }}>
                      <Link to="/deleteCol" className="btn btn-danger btn-sm">
                        Manage / Delete collection
                      </Link>
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <Link to="/collectionCreation" className="btn btn-danger btn-sm">
                        Manage / Add collection
                      </Link>
                    </div>
                    </div>
                  )}
      </div>

      <section className="block" style={{ paddingTop: 60 }}>
        <StaggerGrid className="grid-3">
          {myCollection.map((c) => (
          
            <div id='collectionD_Btn'>
            <CollectionCard key={c.id} collection={c} />
            </div>
          ))}
          
        </StaggerGrid>
      </section>
    </div>
  );
}
