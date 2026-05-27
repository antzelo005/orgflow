import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { OrgNode } from "../api/types";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { PageHeader } from "../components/ui/PageHeader";
import { getOrgChart } from "../features/orgchart/orgChartApi";

function NodeCard({ node }: { node: OrgNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <li className="org-node">
      <div className="org-card">
        <div className="org-card-head">
          <img src={node.profile_image_url || "https://via.placeholder.com/64x64?text=User"} alt={node.full_name} className="avatar" />
          <div>
            <strong>{node.full_name}</strong>
            <p>{node.job_title}</p>
            <span>{node.department_name}</span>
          </div>
        </div>
        {node.reports.length > 0 && (
          <button className="ghost-button small" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {expanded ? "Collapse" : "Expand"} {node.reports.length} reports
          </button>
        )}
      </div>

      {expanded && node.reports.length > 0 && (
        <ul className="org-children">
          {node.reports.map((report) => (
            <NodeCard key={report.id} node={report} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function OrgChartPage() {
  const [nodes, setNodes] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getOrgChart()
      .then(setNodes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen label="Loading organizational chart..." />;
  }

  return (
    <section className="page-section">
      <PageHeader title="Organizational Chart" description="Explore the reporting hierarchy from CEO to department teams." />
      {nodes.length === 0 ? (
        <EmptyState title="No reporting structure yet" description="Create employees and assign managers to build the chart." />
      ) : (
        <div className="org-wrapper">
          <ul className="org-root">
            {nodes.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
