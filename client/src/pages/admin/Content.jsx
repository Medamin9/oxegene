import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';

function Content() {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('hero');
  const [editedContent, setEditedContent] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  // Fetch all content
  const { data, isLoading } = useQuery('adminContent', async () => {
    const response = await fetch('/api/admin/content', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
  });

  // Update content mutation
  const updateContentMutation = useMutation(
    async ({ key, content, section }) => {
      const response = await fetch(`/api/admin/content/${key}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content, section }),
      });
      if (!response.ok) throw new Error('Failed to update content');
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminContent');
        queryClient.invalidateQueries('content');
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 3000);
      },
      onError: () => {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 3000);
      },
    }
  );

  const contentSections = data?.content || [];
  const currentContent = contentSections.find((c) => c.key === activeSection);
  const contentData = editedContent[activeSection] || currentContent?.content || {};

  const handleFieldChange = (field, value) => {
    setEditedContent({
      ...editedContent,
      [activeSection]: {
        ...contentData,
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    setSaveStatus('saving');
    updateContentMutation.mutate({
      key: activeSection,
      content: editedContent[activeSection] || contentData,
      section: activeSection,
    });
  };

  const handleReset = () => {
    const resetContent = { ...editedContent };
    delete resetContent[activeSection];
    setEditedContent(resetContent);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
          <span className="font-body-lg text-on-surface-variant">Loading content...</span>
        </div>
      </div>
    );
  }

  const sections = [
    { key: 'hero', label: 'Hero Section', icon: 'home' },
    { key: 'contact', label: 'Contact Info', icon: 'contact_mail' },
    { key: 'footer', label: 'Footer', icon: 'footer' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Content Management</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Edit site content for hero, contact, and footer sections
          </p>
        </div>
        {saveStatus && (
          <div
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              saveStatus === 'saved'
                ? 'bg-tertiary-container text-on-tertiary-container'
                : saveStatus === 'saving'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-error-container text-on-error-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {saveStatus === 'saved' ? 'check_circle' : saveStatus === 'saving' ? 'progress_activity' : 'error'}
            </span>
            <span className="font-label-md">
              {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'saving' ? 'Saving...' : 'Error saving'}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Section Selector */}
        <div className="w-64 space-y-2">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === section.key
                  ? 'bg-primary-container text-on-primary-container shadow-md'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{section.icon}</span>
              <span className="font-label-lg">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div className="flex-1 space-y-4">
          <div className="glass-effect rounded-lg p-6 space-y-6">
            {activeSection === 'hero' && (
              <HeroEditor content={contentData} onChange={handleFieldChange} />
            )}
            {activeSection === 'contact' && (
              <ContactEditor content={contentData} onChange={handleFieldChange} />
            )}
            {activeSection === 'footer' && (
              <FooterEditor content={contentData} onChange={handleFieldChange} />
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-outline-variant">
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-all font-label-lg flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Changes
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-label-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hero Section Editor
function HeroEditor({ content, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="font-headline-md text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined">home</span>
        Hero Section
      </h2>

      <div className="space-y-4">
        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Title</label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter hero title"
          />
        </div>

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Subtitle</label>
          <input
            type="text"
            value={content.subtitle || ''}
            onChange={(e) => onChange('subtitle', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter subtitle"
          />
        </div>

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Description</label>
          <textarea
            value={content.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Enter hero description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Current Lot</label>
            <input
              type="text"
              value={content.currentLot || ''}
              onChange={(e) => onChange('currentLot', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Lot #4721 — Colombian Supremo"
            />
          </div>

          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Average Extraction</label>
            <input
              type="text"
              value={content.averageExtraction || ''}
              onChange={(e) => onChange('averageExtraction', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 18-22s Avg Extraction"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Section Editor
function ContactEditor({ content, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="font-headline-md text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined">contact_mail</span>
        Contact Information
      </h2>

      <div className="space-y-4">
        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Address</label>
          <textarea
            value={content.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Enter full address"
          />
        </div>

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Phone</label>
          <input
            type="text"
            value={content.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Phone number"
          />
        </div>

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Hours</label>
          <textarea
            value={content.hours || ''}
            onChange={(e) => onChange('hours', e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Business hours"
          />
        </div>

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Twilight Rituals</label>
          <input
            type="text"
            value={content.twilightRituals || ''}
            onChange={(e) => onChange('twilightRituals', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Special hours or events"
          />
        </div>
      </div>
    </div>
  );
}

// Footer Section Editor
function FooterEditor({ content, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="font-headline-md text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined">footer</span>
        Footer Content
      </h2>

      <div className="space-y-4">
        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Description</label>
          <textarea
            value={content.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Footer description"
          />
        </div>

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Social Description</label>
          <input
            type="text"
            value={content.socialDescription || ''}
            onChange={(e) => onChange('socialDescription', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Social media description"
          />
        </div>

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Copyright Text</label>
          <input
            type="text"
            value={content.copyright || ''}
            onChange={(e) => onChange('copyright', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="© 2024 Oxegene Coffee..."
          />
        </div>

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Tagline</label>
          <input
            type="text"
            value={content.tagline || ''}
            onChange={(e) => onChange('tagline', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Footer tagline"
          />
        </div>
      </div>
    </div>
  );
}

export default Content;
