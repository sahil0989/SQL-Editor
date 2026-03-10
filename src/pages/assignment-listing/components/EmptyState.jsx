import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const EmptyState = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-[var(--color-muted)] flex items-center justify-center mb-4">
      <Icon name="SearchX" size={28} color="var(--color-muted-foreground)" />
    </div>
    <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2">No assignments found</h3>
    <p className="text-sm text-[var(--color-muted-foreground)] max-w-xs mb-6">
      Try adjusting your search or filter criteria to find matching assignments.
    </p>
    <Button variant="outline" size="sm" iconName="RotateCcw" iconPosition="left" onClick={onReset}>
      Reset Filters
    </Button>
  </div>
);

export default EmptyState;