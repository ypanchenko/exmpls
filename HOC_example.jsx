import React, { Component } from 'react';

function GeneralTableHOC(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isShowTableSettings: false,
        selection: [],
        selectAll: false,
        tags: {
          showModal: false,
          data: [],
        },
        showFormModal: this.props.match.params.edit === 'new' || false,
        showEditFormModal: this.props.match.params.edit === 'edit' || false,
        showDeleteDialog: false,
        showConfirmationDialog: false,
        highlighted: {},
      };
      this.handleFilter = this.handleFilter.bind(this);
      this.handleCloseForm = this.handleCloseForm.bind(this);
      this.handleOpenForm = this.handleOpenForm.bind(this);
      this.handleOpenEditForm = this.handleOpenEditForm.bind(this);
      this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
      this.onTableSettingsHide = this.onTableSettingsHide.bind(this);
      this.setSelection = this.setSelection.bind(this);
      this.showTableSettings = this.showTableSettings.bind(this);
      this.tagsHandleModal = this.tagsHandleModal.bind(this);
      this.tagsSetData = this.tagsSetData.bind(this);
      this.tagsSubmit = this.tagsSubmit.bind(this);
      this.handleSelectAll = this.handleSelectAll.bind(this);
      this.handleDeleteDialog = this.handleDeleteDialog.bind(this);
      this.handleConfirmationDialog = this.handleConfirmationDialog.bind(this);
      this.setHighlighted = this.setHighlighted.bind(this);
    }

    handleFilter(cItems) {
      if (!cItems) {
        return;
      }
      const { selection } = this.state;
      const _data = selection.filter((id) => cItems.map((el) => el.id)
        .indexOf(id) > 0);
      this.setSelection(_data);
    }

    handleSelectAll(value = false) {
      this.setState({ selectAll: value });
    }

    handleCloseForm() {
      this.setState({ showFormModal: false });
    }

    handleOpenForm() {
      this.setState({ showFormModal: true });
    }

    handleOpenEditForm() {
      this.setState({ showEditFormModal: true });
    }

    handleCloseEditForm() {
      this.setState({ showEditFormModal: false });
    }

    handleDeleteDialog() {
      const { showDeleteDialog } = this.state;
      this.setState({ showDeleteDialog: !showDeleteDialog });
    }

    handleConfirmationDialog() {
      const { showConfirmationDialog } = this.state;
      this.setState({ showConfirmationDialog: !showConfirmationDialog });
    }

    onTableSettingsHide() {
      this.setState({ isShowTableSettings: false });
    }

    setSelection(data, currentItem, setTags = false) {
      this.setState({ selection: data });
      if (setTags && currentItem) {
        const _tags = (currentItem.tags) || [];
        this.tagsSetData(_tags);
      }
    }

    showTableSettings() {
      const { isShowTableSettings } = this.state;
      this.setState({ isShowTableSettings: !isShowTableSettings });
    }

    tagsHandleModal() {
      const { tags } = this.state;
      this.setState({
        tags: {
          ...tags,
          showModal: !tags.showModal,
        },
      });
    }

    tagsSetData(data) {
      const { tags } = this.state;
      this.setState({
        tags: {
          ...tags,
          data,
        },
      });
    }

    tagsSubmit(promiseSb) {
      const {
        selection,
        tags,
      } = this.state;
      if (selection.length === 0 || !promiseSb) {
        return;
      }
      promiseSb(tags);
    }

    setHighlighted(data) {
      if (data) {
        this.setState({ highlighted: data });
      }
    }

    render() {
      const newProps = {
        ...this.props,
        staticState: this.state,
        staticMethods: {
          handleFilter: this.handleFilter,
          handleCloseForm: this.handleCloseForm,
          handleOpenForm: this.handleOpenForm,
          handleOpenEditForm: this.handleOpenEditForm,
          handleCloseEditForm: this.handleCloseEditForm,
          onTableSettingsHide: this.onTableSettingsHide,
          showTableSettings: this.showTableSettings,
          setSelection: this.setSelection,
          tagsHandleModal: this.tagsHandleModal,
          tagsSetData: this.tagsSetData,
          tagsSubmit: this.tagsSubmit,
          handleSelectAll: this.handleSelectAll,
          handleDeleteDialog: this.handleDeleteDialog,
          handleConfirmationDialog: this.handleConfirmationDialog,
          setHighlighted: this.setHighlighted,
        },
      };
      return <WrappedComponent {...newProps} />;
    }
  };
}

export default GeneralTableHOC;
