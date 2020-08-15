$(function () {
    $("#fornecedores").DataTable({
        "language": {
            "url": "datatables/json/Portuguese-Brasil.json"
        },
        "paging": false,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true
    });
});