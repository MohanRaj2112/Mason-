    addToCart(tool);
    showToast(`Added ${tool.name} to equipment cart! 🛒`, 'success');
  };

  const handleRentNowClick = (e) => {
    e.stopPropagation();
    if (!isActionable) return;
