// Knowledge Graph Service for Entity and Relationship Queries
import { KnowledgeGraphNode, KnowledgeGraphEdge, Doctor } from '../../src/types/index.ts';
import { INITIAL_KG_NODES, INITIAL_KG_EDGES } from '../data/mockData.ts';

export class KnowledgeGraphService {
  private nodes: Map<string, KnowledgeGraphNode> = new Map();
  private edges: Map<string, KnowledgeGraphEdge> = new Map();

  constructor() {
    INITIAL_KG_NODES.forEach(n => this.nodes.set(n.id, { ...n }));
    INITIAL_KG_EDGES.forEach(e => this.edges.set(e.id, { ...e }));
  }

  public getGraphData(): { nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
    };
  }

  public findDoctorSubGraph(doctorIdOrName: string): { nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] } {
    const docNode = Array.from(this.nodes.values()).find(
      n => n.type === 'Doctor' && (n.id.includes(doctorIdOrName) || n.label.toLowerCase().includes(doctorIdOrName.toLowerCase()))
    );

    if (!docNode) {
      return { nodes: [], edges: [] };
    }

    const connectedEdges = Array.from(this.edges.values()).filter(
      e => e.source === docNode.id || e.target === docNode.id
    );

    const connectedNodeIds = new Set<string>([docNode.id]);
    connectedEdges.forEach(e => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });

    // Also include second-degree hops (e.g. Hospital -> City, Hospital -> Offers)
    const secondHopEdges = Array.from(this.edges.values()).filter(
      e => connectedNodeIds.has(e.source) && !connectedEdges.includes(e)
    );
    secondHopEdges.forEach(e => {
      connectedNodeIds.add(e.target);
    });

    const relevantEdges = [...connectedEdges, ...secondHopEdges];
    const relevantNodes = Array.from(this.nodes.values()).filter(n => connectedNodeIds.has(n.id));

    return { nodes: relevantNodes, edges: relevantEdges };
  }

  public executeGraphQuery(criteria: {
    specialization?: string;
    city?: string;
    hospital?: string;
  }): { doctors: string[]; explanation: string } {
    let matchedDocNodeIds = new Set<string>();

    const docNodes = Array.from(this.nodes.values()).filter(n => n.type === 'Doctor');
    const edges = Array.from(this.edges.values());

    for (const doc of docNodes) {
      let matches = true;

      // Filter by specialization edge
      if (criteria.specialization) {
        const specMatches = edges.some(e => {
          if (e.source !== doc.id || e.relationship !== 'specializes_in') return false;
          const targetNode = this.nodes.get(e.target);
          return targetNode && targetNode.label.toLowerCase().includes(criteria.specialization!.toLowerCase());
        });
        if (!specMatches) matches = false;
      }

      // Filter by hospital edge
      if (matches && criteria.hospital) {
        const hospMatches = edges.some(e => {
          if (e.source !== doc.id || e.relationship !== 'works_at') return false;
          const targetNode = this.nodes.get(e.target);
          return targetNode && targetNode.label.toLowerCase().includes(criteria.hospital!.toLowerCase());
        });
        if (!hospMatches) matches = false;
      }

      // Filter by city edge (Doctor -> works_at -> Hospital -> located_in -> City)
      if (matches && criteria.city) {
        const worksAtHospitals = edges
          .filter(e => e.source === doc.id && e.relationship === 'works_at')
          .map(e => e.target);

        const inCity = edges.some(e => {
          if (!worksAtHospitals.includes(e.source) || e.relationship !== 'located_in') return false;
          const targetCity = this.nodes.get(e.target);
          return targetCity && targetCity.label.toLowerCase().includes(criteria.city!.toLowerCase());
        });

        if (!inCity) matches = false;
      }

      if (matches) {
        matchedDocNodeIds.add(doc.id);
      }
    }

    const matchedNames = Array.from(matchedDocNodeIds).map(id => this.nodes.get(id)!.label);
    const explanation = `Knowledge Graph traversed 2 hops (Doctor → works_at → Hospital → located_in → City) matching ${matchedNames.length} entities.`;

    return { doctors: matchedNames, explanation };
  }

  public addDoctorToGraph(doctor: Doctor) {
    const docNodeId = `node-${doctor.id}`;
    if (!this.nodes.has(docNodeId)) {
      this.nodes.set(docNodeId, {
        id: docNodeId,
        label: doctor.name,
        type: 'Doctor',
        properties: { experience: doctor.experienceYears, tier: doctor.trustTier },
      });
    }

    // Specialization node
    if (doctor.specialization) {
      const specId = `node-spec-${doctor.specialization.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      if (!this.nodes.has(specId)) {
        this.nodes.set(specId, {
          id: specId,
          label: doctor.specialization,
          type: 'Specialization',
          properties: {},
        });
      }
      this.edges.set(`edge-${docNodeId}-${specId}`, {
        id: `edge-${docNodeId}-${specId}`,
        source: docNodeId,
        target: specId,
        relationship: 'specializes_in',
      });
    }

    // Hospital node
    if (doctor.hospital) {
      const hospId = `node-hosp-${doctor.hospital.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      if (!this.nodes.has(hospId)) {
        this.nodes.set(hospId, {
          id: hospId,
          label: doctor.hospital,
          type: 'Hospital',
          properties: {},
        });
      }
      this.edges.set(`edge-${docNodeId}-${hospId}`, {
        id: `edge-${docNodeId}-${hospId}`,
        source: docNodeId,
        target: hospId,
        relationship: 'works_at',
      });

      // City relationship
      if (doctor.city) {
        const cityId = `node-city-${doctor.city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        if (!this.nodes.has(cityId)) {
          this.nodes.set(cityId, {
            id: cityId,
            label: doctor.city,
            type: 'City',
            properties: { state: doctor.state },
          });
        }
        this.edges.set(`edge-${hospId}-${cityId}`, {
          id: `edge-${hospId}-${cityId}`,
          source: hospId,
          target: cityId,
          relationship: 'located_in',
        });
      }
    }
  }
}
