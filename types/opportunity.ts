export type OpportunityType = 'ra_position' | 'internship' | 'full_time' | 'project_grant' | 'gig';

export interface Opportunity {
    id: string;
    title: string;
    organization: string;
    opportunity_type: OpportunityType;
    location: string;
    stipend_range: string;
    description: string;
    skills_required: string[];
    min_level_required: number;
    contact_email: string;
    deadline?: string;
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
    user_has_applied?: boolean;
}

export interface OpportunityApplication {
    id: string;
    opportunity_id: string;
    user_id: string;
    cover_note: string;
    portfolio_link?: string;
    status: 'pending' | 'under_review' | 'shortlisted' | 'accepted' | 'rejected';
    created_at: string;
}
