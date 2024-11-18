const preventFormDefaultBehaviourOnSubmit = (event) => {
    event.preventDefault();
    return false;
};

function add_customer() {
    const url = 'customers/add/modal' + case_param();
    $('#modal_add_customer_content').load(url, function (response, status, xhr) {
        if (status !== "success") {
             ajax_notify_error(xhr, url);
             return false;
        }
        $('#form_new_customer').on("submit", preventFormDefaultBehaviourOnSubmit);
        $('#submit_new_customer').on("click", function () {
            const form = $('#form_new_customer').serializeObject();

            ret = get_custom_attributes_fields();
            has_error = ret[0].length > 0;
            attributes = ret[1];

            if (has_error) {
                return false;
            }

            form['custom_attributes'] = attributes;

            post_request_api('/manage/customers/add', JSON.stringify(form), true)
            .done((data) => {
                 if(notify_auto_api(data)) {
                    refresh_customer_table();
                    $('#modal_add_customer').modal('hide');
                 }
            });

            return false;
        })
    });
    $('#modal_add_customer').modal({show: true});
}

$(document).ready(function() {
    let cid = case_param();
    $('#customers_table').dataTable({
            "ajax": {
                "url": `/manage/customers/list${cid}`,
                "contentType": "application/json",
                "type": "GET",
                "data": function (d) {
                    if (d.status == 'success') {
                        return JSON.stringify(d.data);
                    } else {
                        return [];
                    }
                }
            },
            "order": [[0, "desc"]],
            "autoWidth": false,
            "columns": [
                {
                    "data": "customer_name",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            data = sanitizeHTML(data);
                            return '<a href="/manage/customers/' + row['customer_id'] + '/view'+ cid +'">' + data + '</a>';
                        }
                        return data;
                    }
                },
                {

                    "data": "customer_short",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            data = sanitizeHTML(data);
                            return '<a href="/manage/customers/' + row['customer_id'] + '/view'+ cid +'">' + data + '</a>';
                        }
                        return data;
                    }
		},
                {
                    "data": "customer_top",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            data = sanitizeHTML(data);
                            return '<a href="/manage/customers/' + row['customer_id_top'] + '/view'+ cid +'">' + data + '</a>';
                        }
                        return data;
                    }
		},
                {
                    "data": "customer_description",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            return sanitizeHTML(data);
                        }
                        return data;
                    }
                }
            ]
        }
    );
});

function refresh_customer_table(do_notify) {
    $('#customers_table').DataTable().ajax.reload();
    if (do_notify !== undefined) {
        notify_success("Refreshed");
    }
}

function select_contact_table(do_notify) {
    let cid = case_param();
    $('table thead tr').replaceWith('<tr><th>Name</th><th>Roles</th><th>E-Mail</th><th>Customer</th></tr>')
    $('table tfoot tr').replaceWith('<tr><th>Name</th><th>Roles</th><th>E-Mail</th><th>Customer</th></tr>')
    $('#customers_table').DataTable().clear().destroy();

 $('#customers_table').dataTable({
            "ajax": {
                "url": "contacts/list" + cid,
                "contentType": "application/json",
                "type": "GET",
                "data": function (d) {
                    if (d.status == 'success') {
                        return JSON.stringify(d.data);
                    } else {
                        return [];
                    }
                }
            },
            "order": [[0, "desc"]],
            "autoWidth": false,
            "columns": [
                {
                    "data": "contact_name",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            data = sanitizeHTML(data);
                            return '<a id="myLink" href="#" onclick="edit_contact(' + row['contact_id'] + "," + row['contact_client_id'] + ');">' + row["contact_name"]+ '</a>'

                        }
                        return data;
                    }
                },
                {
                    "data": "contact_role",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            return sanitizeHTML(data);
                        }
                        return data;
                    }
		},
                {
                    "data": "contact_email",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            return sanitizeHTML(data);
                        }
                        return data;
                    }
		},
                {
                    "data": "contact_client",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            data = sanitizeHTML(data);
                            return '<a href="/manage/customers/' + row['contact_client_id'] + '/view'+ cid +'">' + data + '</a>';
                        }
                        return data;
                    }
                }
            ]
        }
    );
    }
function select_customer_table(do_notify) {
    let cid = case_param();
    $('table thead tr').replaceWith('<tr><th>Name</th><th>Short</th><th>Superior</th><th>Description</th></tr>')
    $('table tfoot tr').replaceWith('<tr><th>Name</th><th>Short</th><th>Superior</th><th>Description</th></tr>')
   $('#customers_table').DataTable().clear().destroy();

 $('#customers_table').dataTable({
            "ajax": {
                "url": "customers/list" + cid,
                "contentType": "application/json",
                "type": "GET",
                "data": function (d) {
                    if (d.status == 'success') {
                        return JSON.stringify(d.data);
                    } else {
                        return [];
                    }
                }
            },
            "order": [[0, "desc"]],
            "autoWidth": false,
            "columns": [
                {
                    "data": "customer_name",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            data = sanitizeHTML(data);
                            return '<a href="/manage/customers/' + row['customer_id'] + '/view'+ cid +'">' + data + '</a>';
                        }
                        return data;
                    }
                },
                {
                    "data": "customer_short",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            data = sanitizeHTML(data);
                            return '<a href="/manage/customers/' + row['customer_id'] + '/view'+ cid +'">' + data + '</a>';
                        }
                        return data;
                    }
		},
                {
                    "data": "customer_top",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            data = sanitizeHTML(data);
                            return '<a href="/manage/customers/' + row['customer_id_top'] + '/view'+ cid +'">' + data + '</a>';
                        }
                        return data;
                    }
		},
                {
                    "data": "customer_description",
                    "render": function (data, type, row) {
                        if (type === 'display') {
                            return sanitizeHTML(data);
                        }
                        return data;
                    }
                }
            ]
        }
    );
    }

/* Fetch the details of an asset and allow modification */
function customer_detail(customer_id) {
    url = '/manage/customers/update/' + customer_id + '/modal' + case_param();
    $('#modal_add_customer_content').load(url, function (response, status, xhr) {
        if (status !== "success") {
             ajax_notify_error(xhr, url);
             return false;
        }

        $('#form_new_customer').on("submit", preventFormDefaultBehaviourOnSubmit);
        $('#submit_new_customer').on("click", function () {

            const form = $('#form_new_customer').serializeObject();
            ret = get_custom_attributes_fields();
            has_error = ret[0].length > 0;
            attributes = ret[1];

            if (has_error){return false;}

            form['custom_attributes'] = attributes;

            post_request_api(`/manage/customers/update/${customer_id}`, JSON.stringify(form), true)
            .done((data) => {
                if(notify_auto_api(data)) {
                    window.location.reload();
                }
            });

            return false;
        })


    });
    $('#modal_add_customer').modal({show: true});
}

function delete_customer(id) {
    swal({
        title: "Are you sure ?",
        text: "You won't be able to revert this !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })
    .then((willDelete) => {
        if (willDelete) {
            post_request_api(`/manage/customers/delete/${id}`)
            .done((data) => {
                if(notify_auto_api(data)) {
                    window.location.href = '/manage/customers' + case_param();
                }
            });
        } else {
            swal("Pfew, that was close");
        }
    });
}

function edit_contact(contact_id, customer_id) {
    url = '/manage/customers/' + customer_id + '/contacts/' + contact_id + '/modal' + case_param();
    $('#modal_add_contact_content').load(url, function (response, status, xhr) {
        if (status !== "success") {
             ajax_notify_error(xhr, url);
             return false;
        }

        $('#form_new_contact').on("submit", preventFormDefaultBehaviourOnSubmit);
        $('#submit_new_contact').on("click", function () {

            const form = $('#form_new_contact').serializeObject();

            post_request_api('/manage/customers/' + customer_id + '/contacts/' + contact_id + '/update', JSON.stringify(form), true)
            .done((data) => {
                if(notify_auto_api(data)) {
                    window.location.reload();
                }
            });

            return false;
        });


        $('#submit_delete_contact').on("click", function () {
            post_request_api('/manage/customers/' + customer_id + '/contacts/' + contact_id + '/delete')
            .done((data) => {
                if(notify_auto_api(data)) {
                    window.location.reload();
                }
            });
            return false;
        });
    });
    $('#modal_add_contact').modal({show: true});
}